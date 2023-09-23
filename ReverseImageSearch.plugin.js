/**
 * @name ReverseImageSearch 
 * @version 2.0.6
 * @description A plugin to reverse image search on images in Discord using TinEye.
 * @author rxwa
 */

module.exports = class ReverseImageSearch {
  constructor() {
    // Initialize variables
    this.contextMenuListener = null;
    this.reverseImageSearchButton = null; // Store a reference to the button
  }

  start() {
    // This function is called when the plugin is enabled.
    // Add the context menu item for reverse image search.
    this.attachContextMenu();
    this.attachClickListener();
  }

  stop() {
    // This function is called when the plugin is disabled.
    // Remove the context menu item, the button, and the click listener.
    this.detachContextMenu();
    this.removeReverseImageSearchButton();
    this.detachClickListener();
  }

  attachContextMenu() {
    // Add the context menu item for reverse image search.
    this.contextMenuListener = this.handleContextMenu.bind(this);
    document.addEventListener('contextmenu', this.contextMenuListener);
  }

  detachContextMenu() {
    // Remove the context menu item and the listener.
    document.removeEventListener('contextmenu', this.contextMenuListener);
  }

  attachClickListener() {
    // Add a click event listener to the document body to detect clicks outside the context menu.
    this.clickListener = this.handleDocumentClick.bind(this);
    document.addEventListener('click', this.clickListener);
  }

  detachClickListener() {
    // Remove the click event listener.
    document.removeEventListener('click', this.clickListener);
  }

  handleContextMenu(event) {
    const target = event.target;
    if (target.tagName === 'IMG' && !this.reverseImageSearchButton) {
      const imageUrl = target.src;
      const { clientX, clientY } = event; // Destructure clientX and clientY
      this.createReverseImageSearchButton(imageUrl, clientX, clientY);
    }
  }

  handleDocumentClick(event) {
    // Check if the click occurred outside the context menu.
    if (this.reverseImageSearchButton && !this.reverseImageSearchButton.contains(event.target)) {
      this.removeReverseImageSearchButton();
    }
  }

  createReverseImageSearchButton(imageUrl, clientX, clientY) {
    // Create a visible button for reverse image search.
    this.reverseImageSearchButton = document.createElement('button');
    this.reverseImageSearchButton.className = 'reverse-image-search-button';
    this.reverseImageSearchButton.textContent = 'Reverse Image Search';

    // Style the button to make it easy to see.
    this.reverseImageSearchButton.style.position = 'fixed';
    this.reverseImageSearchButton.style.top = `${clientY}px`;
    this.reverseImageSearchButton.style.left = `${clientX}px`;
    this.reverseImageSearchButton.style.zIndex = '9999';
    this.reverseImageSearchButton.style.backgroundColor = 'black';
    this.reverseImageSearchButton.style.color = 'white';
    this.reverseImageSearchButton.style.border = 'none';
    this.reverseImageSearchButton.style.padding = '10px';
    this.reverseImageSearchButton.style.borderRadius = '5px';
    this.reverseImageSearchButton.style.cursor = 'pointer';

    // Add an event listener to open the reverse image search when clicked.
    const clickListener = () => {
      this.performReverseImageSearch(imageUrl);
      // Remove the button and its click listener.
      this.removeReverseImageSearchButton();
    };

    this.reverseImageSearchButton.addEventListener('click', clickListener);

    // Append the button to the document body.
    document.body.appendChild(this.reverseImageSearchButton);
  }

  removeReverseImageSearchButton() {
    if (this.reverseImageSearchButton) {
      // Remove the button and set the reference to null.
      document.body.removeChild(this.reverseImageSearchButton);
      this.reverseImageSearchButton = null;
    }
  }

  performReverseImageSearch(imageUrl) {
    // Open a new tab with TinEye's reverse image search.
    const searchUrl = `https://tineye.com/search?url=${encodeURIComponent(imageUrl)}`;
    window.open(searchUrl, '_blank');
  }
};
