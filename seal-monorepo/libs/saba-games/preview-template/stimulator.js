const COLLAPSED_WIDTH = '3.75rem';
const EXPANDED_WIDTH = '244px';

class Sidebar {
    constructor(position) {
        this.position = position;
        this.isOpen = false;
        this.width = COLLAPSED_WIDTH;
        this.element = this.createSidebar();
    }

    createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = `${this.position}-bar`;

        const button = document.createElement('button');
        button.textContent = this.position === 'left' ? '◀ Toggle Left' : 'Toggle Right ▶';
        button.addEventListener('click', () => this.toggle());

        sidebar.appendChild(button);
        return sidebar;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.width = this.isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
        document.documentElement.style.setProperty(`--${this.position}-width`, this.width);
    }
}

class MainArea {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.init();
    }

    init() {
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-container';

        // Create sidebars
        this.leftSidebar = new Sidebar('left');
        this.rightSidebar = new Sidebar('right');

        // Create main content area
        const mainArea = document.createElement('div');
        mainArea.className = 'main-area';

        // Assemble the layout
        mainContainer.appendChild(this.leftSidebar.element);
        mainContainer.appendChild(mainArea);
        mainContainer.appendChild(this.rightSidebar.element);

        // Add to the page
        this.container.appendChild(mainContainer);
    }

    // Method to set content in the main area
    setContent(content) {
        const mainArea = this.container.querySelector('.main-area');
        if (typeof content === 'string') {
            mainArea.innerHTML = content;
        } else if (content instanceof Node) {
            mainArea.innerHTML = '';
            mainArea.appendChild(content);
        }
    }
}

// Usage example:
const mainArea = new MainArea('#app');
const root = document.getElementById('root');
mainArea.setContent(root);
