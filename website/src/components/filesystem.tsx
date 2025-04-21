
interface FileNode {
  name: string;
  isDirectory: boolean;
  parent: FileNode | null;
  content?: string | null; // For files, e.g., portfolio item description or link
  children?: Record<string, FileNode> | null; // Only directories have children
}

interface NodeInfo {
    name: string;
    isDirectory: boolean;
    path: string;
    content?: string | null;
    children: string[] | null;
  }

export class FileTree {
  private root: FileNode;
  private currentNode: FileNode;

  constructor() {
    // Initialize root directory
    this.root = {
      name: '/',
      isDirectory: true,
      parent: null,
      children: {},
    };
    this.currentNode = this.root;
    this.root.children!['.'] = this.root;
  }

  addNode(
    name: string,
    isDirectory: boolean = false,
    parent: FileNode | null = null,
    content: string | null = null
  ): FileNode {
    const targetParent = parent || this.currentNode;
    if (!targetParent.isDirectory) {
      throw new Error('Parent must be a directory');
    }
    if (targetParent.children![name]) {
      throw new Error(`Node '${name}' already exists in directory`);
    }

    const newNode: FileNode = {
      name,
      isDirectory,
      parent: targetParent,
      content,
      children: isDirectory ? {} : null,
    };

    targetParent.children![name] = newNode;

    // If directory, add special '.' and '..' nodes
    if (isDirectory) {
      newNode.children!['.'] = newNode;
      newNode.children!['..'] = targetParent;
    }

    return newNode;
  }

  navigate(path: string): boolean {
    let targetNode = path.startsWith('/') ? this.root : this.currentNode;
    if (path === '/') {
      this.currentNode = this.root;
      return true;
    }

    const parts = path
      .replace(/^\/|\/$/g, '')
      .split('/')
      .filter((p) => p);

    for (const part of parts) {
      if (!targetNode.isDirectory || !targetNode.children![part]) {
        return false;
      }
      targetNode = targetNode.children![part];
    }

    this.currentNode = targetNode;
    return true;
  }

  getNodeInfo(name?: string): NodeInfo | null {
    const node = name ? this.currentNode.children?.[name] : this.currentNode;
    if (!node) {
      return null;
    }
    return {
      name: node.name,
      isDirectory: node.isDirectory,
      path: this.getFullPath(node),
      content: node.content,
      children: node.isDirectory ? Object.keys(node.children!) : null,
    };
  }

  listDirectory(): Array<{ name: string; isDirectory: boolean }> {
    if (!this.currentNode.isDirectory) {
      return [];
    }
    return Object.entries(this.currentNode.children!).map(([name, node]) => ({
      name,
      isDirectory: node.isDirectory,
    }));
  }

  getFullPath(node: FileNode): string {
    if (node === this.root) {
      return '/';
    }
    const path: string[] = [];
    let current: FileNode | null = node;
    while (current && current !== this.root) {
      path.push(current.name);
      current = current.parent;
    }
    return '/' + path.reverse().join('/');
  }

  getCurrentPath(): string {
    return this.getFullPath(this.currentNode);
  }
}
