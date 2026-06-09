import { createClient } from '@supabase/supabase-js';
import { imageArray } from './service';
import { renderTemplates } from './template';
import { setupOpenMemeEvents } from './eventListener';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function loadTemplates() {
  let images;
  if (imageArray.length === 0) {
    const { data: files, error } = await supabase.storage
      .from('meme-templates')
      .list();

    images = await getImageFiles(files);
    if (error) {
      console.error(error);
      return;
    }
  } else {
    images = imageArray
  }

  renderTemplates(images)
  setupOpenMemeEvents();

}


async function getImageFiles(files) {
  if (imageArray.length > 0) return imageArray

  files.map((file) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from('meme-templates').getPublicUrl(file.name);

    imageArray.push(
      {
        ...file,
        publicUrl,
      }
    )
  });

  for (const element of imageArray) {
    const response = await fetch(element.publicUrl);
    const blob = await response.blob();

    element.localUrl = URL.createObjectURL(blob);
  }

  return imageArray
}
