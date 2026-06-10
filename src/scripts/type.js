/**
 * @fileoverview Type definitions and data models for meme generator.
 */

/**
 * Represents a generated meme.
 * @class CustomMeme
 * @property {string} id - Unique identifier (UUID)
 * @property {boolean} votingSelected - Whether meme is selected for voting
 * @property {string} file - Data URL or image file reference
 * @property {string} author - Author/creator name
 */
export class CustomMeme {
  
  id = crypto.randomUUID();
  votingSelected = false;
  liked=false;
  blob;
  name;
  author;

  /**
   * Creates a new CustomMeme instance.
   * @constructor
   * @param {string} file - Data URL or image file reference
   * @param {string} author - Author/creator name
   */
  constructor( file,name, author) {
    this.blob = file;
    this.name = name;
    this.author = author;
  }
}
