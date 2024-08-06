class Manifesto {
    constructor() {
        this.manifestos = [];
        this.tags = new Set(['All']);  // 添加 'All' 作为默认标签
    }

    async loadManifestos() {
        try {
            const response = await fetch('content/');
            const directoryListing = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(directoryListing, 'text/html');
            const links = doc.querySelectorAll('a');
            
            for (const link of links) {
                const fileName = link.getAttribute('href');
                if (fileName.endsWith('.md')) {
                    const manifestoResponse = await fetch(`content/${fileName}`);
                    const manifestoContent = await manifestoResponse.text();
                    const manifesto = this.parseManifesto(manifestoContent, fileName);
                    this.manifestos.push(manifesto);
                    manifesto.tags.forEach(tag => this.tags.add(tag));
                }
            }
        } catch (error) {
            console.error('Error loading manifestos:', error);
        }
    }

    parseManifesto(content, filename) {
        const lines = content.split('\n');
        const metadata = {};
        let i = 1;  // Skip the first line (title)
        while (lines[i] && lines[i].includes(':')) {
            const [key, value] = lines[i].split(':').map(s => s.trim());
            metadata[key.toLowerCase()] = value;
            i++;
        }
        const markdownContent = lines.slice(i).join('\n');

        // 使用自定义渲染器来处理图片路径
        const renderer = new marked.Renderer();
        renderer.image = (href, title, text) => {
            // 确保图片路径正确
            const imagePath = href.startsWith('/') ? href : `/${href}`;
            return `<img src="${imagePath}" alt="${text}" title="${title || ''}" />`;
        };

        return {
            id: filename.replace('.md', ''),
            title: lines[0].replace('# ', ''),
            thumbnail: metadata.thumbnail || metadata.image,
            image: metadata.image,
            tags: metadata.tags ? metadata.tags.split(',').map(s => s.trim()) : [],
            industry: metadata.industry,
            year: metadata.year,
            content: marked(markdownContent, { renderer })
        };
    }

    getManifestoById(id) {
        return this.manifestos.find(m => m.id === id);
    }

    getManifestosByTag(tag) {
        if (tag === 'All') return this.manifestos;
        return this.manifestos.filter(m => m.tags.includes(tag));
    }

    getAllTags() {
        return Array.from(this.tags);
    }
}

const manifestoManager = new Manifesto();