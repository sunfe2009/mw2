async function initializeApp() {
    await manifestoManager.loadManifestos();
    displayTags();
    displayManifestos(manifestoManager.manifestos);
}

function displayTags() {
    const tagsContainer = document.querySelector('.tags-container');
    tagsContainer.innerHTML = ''; // 清空现有标签
    manifestoManager.getAllTags().forEach(tag => {
        const button = document.createElement('button');
        button.classList.add('tag');
        button.setAttribute('data-tag', tag);
        button.textContent = tag;
        if (tag === 'All') {
            button.classList.add('active');
        }
        tagsContainer.appendChild(button);
    });

    tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const tag = e.target.dataset.tag;
            const filteredManifestos = manifestoManager.getManifestosByTag(tag);
            displayManifestos(filteredManifestos);
        }
    });
}

function displayManifestos(manifestos) {
    const grid = document.getElementById('manifesto-grid');
    grid.innerHTML = '';
    manifestos.forEach(manifesto => {
        const item = document.createElement('div');
        item.classList.add('manifesto-item');
        item.innerHTML = `
            <img src="${manifesto.thumbnail}" alt="${manifesto.title} thumbnail">
            <p>${manifesto.title}</p>
            <div class="manifesto-tags">
                ${manifesto.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        item.addEventListener('click', () => openManifestoDetail(manifesto.id));
        grid.appendChild(item);
    });
}

function openManifestoDetail(id) {
    const manifesto = manifestoManager.getManifestoById(id);
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="manifesto-detail">
            <h2>${manifesto.title}</h2>
            <img src="${manifesto.image}" alt="${manifesto.title} image">
            ${manifesto.content}
            <p>Industry: ${manifesto.industry}</p>
            <p>Year: ${manifesto.year}</p>
            <div class="manifesto-tags">
                ${manifesto.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button onclick="backToGrid()">Back to Grid</button>
        </div>
    `;
}

function backToGrid() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', initializeApp);