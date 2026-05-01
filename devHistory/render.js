// global DB
let db = {};
let nodes = [];
let edges = [];
let yMap = {};
const graphMap = { nodes: [], edges: [] };
const panel = document.getElementById('side-panel');

// parse CSV file
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] ? values[i].trim() : null;
        });
        return obj;
    });
}

// fetch csv files
async function initApp() {
    try {
        // load csv files all at once
        const [
            resDomains, resProjects, resGenerations,
            resNodes, resContents, resEdges
        ] = await Promise.all([
            fetch('domains.csv'),
            fetch('projects.csv'),
            fetch('generations.csv'),
            fetch('nodes.csv'),
            fetch('contents.csv'),
            fetch('edges.csv')
        ]);
        const [
            csvDomains, csvProjects, csvGenerations,
            csvNodes, csvContents, csvEdges
        ] = await Promise.all([
            resDomains.text(), resProjects.text(), resGenerations.text(),
            resNodes.text(), resContents.text(), resEdges.text()
        ]);

        // parse CSV
        db = {
            domains: parseCSV(csvDomains).sort((a, b) => a.order - b.order),
            projects: parseCSV(csvProjects),
            generations: parseCSV(csvGenerations),
            nodesRaw: parseCSV(csvNodes),
            contents: parseCSV(csvContents),
            edges: parseCSV(csvEdges)
        };

        // trim datas
        nodes = db.nodesRaw.map(n => {
            const content = db.contents.find(c => c.node_id === n.id) || {};
            const project = db.projects.find(p => p.id === n.project_id) || {};
            const gen = db.generations.find(g => g.id === n.gen_id) || {};
            const repDate = n.dev_start || n.active_start;

            return {
                id: n.id,
                lane_id: `lane-${n.domain_id}`,
                date: repDate,
                devStart: n.dev_start,
                activeStart: n.active_start,
                activeEnd: n.active_end,
                status: n.status || 'Unknown',
                title: content.title || n.id,
                creator: content.creator || '',
                link: content.link || '',
                techstack: content.tech_stack || 'No tech stack.',
                description: content.description || 'No description.',
                genId: n.gen_id || '',
                genColor: gen.color || '#64748b',
                projectName: project.name || null,
                projectColor: project.color || null
            };
        });
        edges = db.edges.map(e => ({ source: e.source_id, target: e.target_id }));

        // start rendering
        renderLanes();
        renderNodes();
        setTimeout(drawEdges, 100);

    } catch (error) {
        console.error("CSV Load Error: ", error);
        alert("Failed to fetch data from CSV files.");
    }
}

// draw swimlanes from domains
function renderLanes() {
    const container = document.getElementById('swimlanes-container');
    const widthPercent = 100 / db.domains.length;

    db.domains.forEach((d) => {
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.id = `lane-${d.id}`;

        const title = document.createElement('div');
        title.className = 'lane-title';
        title.innerText = d.label;

        lane.appendChild(title);
        container.appendChild(lane);
    });
}

// calculate y positions
function calculateYPositions() {
    const validDates = nodes.map(n => n.date).filter(Boolean);
    if (validDates.length === 0) return 0;

    // sort by date
    const uniqueDates = [...new Set(validDates)].sort((a, b) => new Date(b) - new Date(a));
    let currentY = 120;
    const MIN_GAP = 150;
    const MAX_GAP = 350;
    yMap[uniqueDates[0]] = currentY;

    // calculate gap
    for (let i = 1; i < uniqueDates.length; i++) {
        const date1 = new Date(uniqueDates[i-1] + '-01');
        const date2 = new Date(uniqueDates[i] + '-01');
        const monthsDiff = (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
        
        let calculatedGap = MIN_GAP + (monthsDiff * 15);
        if (calculatedGap > MAX_GAP) calculatedGap = MAX_GAP;
        
        currentY += calculatedGap;
        yMap[uniqueDates[i]] = currentY;
    }
}

// draw node
function renderNodes() {
    calculateYPositions();
    const collisionMap = {};
    let maxRenderedY = 0;

    nodes.forEach(n => {
        // get lane
        const lane = document.getElementById(n.lane_id);
        if (!lane) return;

        // create node
        const el = document.createElement('div');
        el.className = `node ${n.status === 'Active' ? 'active-node' : ''}`;
        el.id = n.id;
        
        // prevent collisions
        const baseTop = yMap[n.date];
        const collisionKey = `${n.lane_id}-${baseTop}`;
        const collisionCount = collisionMap[collisionKey] || 0;
        
        const finalTop = baseTop + (collisionCount * 110);
        collisionMap[collisionKey] = collisionCount + 1;
        if (finalTop > maxRenderedY) maxRenderedY = finalTop;

        el.style.top = `${finalTop}px`;
        el.style.left = '50%';
        el.style.borderColor = n.genColor;
        
        // glow and badge when active
        if (n.status === 'Active') {
            el.style.setProperty('--glow-color', `${n.genColor}55`);
            el.style.setProperty('--glow-hover', `${n.genColor}AA`);
        }
        const statusClass = n.status === 'Active' ? 'badge-active' : 'badge-retired';
        let badgesHTML = `<span class="badge ${statusClass}">${n.status}</span>`;
        
        // add project badge
        if (n.projectName) {
            const bg = n.projectColor || '#1e293b';
            badgesHTML += `<span class="badge badge-set" style="background-color: ${bg}; border-color: ${bg};">📦 ${n.projectName}</span>`;
        }

        // add description
        el.innerHTML = `
            <div class="node-header">
                <span class="node-date">${n.date || 'Unknown'}</span>
            </div>
            <div class="node-title">${n.title}</div>
            <div class="badge-group">${badgesHTML}</div>
        `;

        // link events, add node
        el.addEventListener('click', (e) => { e.stopPropagation(); openPanel(n); });
        el.addEventListener('mouseenter', () => highlightGraph(n.id));
        el.addEventListener('mouseleave', clearHighlight);
        lane.appendChild(el);
        graphMap.nodes.push(el);
    });

    // calculate total height
    const totalHeight = maxRenderedY + 300;
    document.getElementById('swimlanes-container').style.minHeight = totalHeight + 'px';
    document.getElementById('svg-layer').style.height = totalHeight + 'px';
}

// draw edges
function drawEdges() {
    const svg = document.getElementById('svg-layer');
    if (!svg) return;
    svg.innerHTML = '';
    graphMap.edges = [];

    edges.forEach(edge => {
        // get source and target
        const sourceEl = document.getElementById(edge.source);
        const targetEl = document.getElementById(edge.target);
        if (!sourceEl || !targetEl) return;

        // calculate path
        const sRect = sourceEl.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const startX = sRect.left + (sRect.width / 2) - svgRect.left;
        const startY = sRect.top - svgRect.top - 2;
        const endX = tRect.left + (tRect.width / 2) - svgRect.left;
        const endY = tRect.bottom - svgRect.top + 10;

        const curveOffsetY = Math.max(Math.abs(startY - endY) / 2.5, 40);
        const pathData = `M ${startX} ${startY} C ${startX} ${startY - curveOffsetY}, ${endX} ${endY + curveOffsetY}, ${endX} ${endY}`;
        
        // create path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'edge');
        path.dataset.source = edge.source;
        path.dataset.target = edge.target;
        svg.appendChild(path);
        graphMap.edges.push(path);

        // create arrow
        const arrowData = `M ${endX - 6} ${endY + 8} L ${endX} ${endY} L ${endX + 6} ${endY + 8}`;
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', arrowData);
        arrow.setAttribute('class', 'edge');
        arrow.dataset.source = edge.source;
        arrow.dataset.target = edge.target;
        svg.appendChild(arrow);
        graphMap.edges.push(arrow);
    });
}

// highlight graph
function highlightGraph(hoveredId) {
    // get nodes to be highlighted
    let connectedIds = new Set([hoveredId]);
    edges.forEach(e => {
        if (e.source === hoveredId || e.target === hoveredId) { 
            connectedIds.add(e.source); 
            connectedIds.add(e.target); 
        }
    });

    // highlight edges
    graphMap.edges.forEach(path => {
        if (path.dataset.source === hoveredId || path.dataset.target === hoveredId) {
            path.classList.add('highlighted'); path.classList.remove('dimmed');
        } else {
            path.classList.add('dimmed'); path.classList.remove('highlighted');
        }
    });

    // highlight nodes
    graphMap.nodes.forEach(node => {
        if (connectedIds.has(node.id)) {
            node.classList.add('highlighted'); node.classList.remove('dimmed');
        } else {
            node.classList.add('dimmed'); node.classList.remove('highlighted');
        }
    });
}

// clear highlight
function clearHighlight() {
    graphMap.edges.forEach(path => path.classList.remove('highlighted', 'dimmed'));
    graphMap.nodes.forEach(node => node.classList.remove('highlighted', 'dimmed'));
}

// side panel open
window.openPanel = function(n) {
    document.getElementById('sp-gen').innerText = `${n.genId.toUpperCase()}`;
    document.getElementById('sp-title').innerText = n.title;
    
    // badges
    const statusClass = n.status === 'Active' ? 'badge-active' : 'badge-retired';
    let badgesHTML = `<span class="badge ${statusClass}">${n.status}</span>`;
    if (n.projectName) {
        const bg = n.projectColor || '#1e293b';
        badgesHTML += `<span class="badge badge-set" style="background-color: ${bg}; border-color: ${bg};">📦 ${n.projectName}</span>`;
    }
    document.getElementById('sp-badges').innerHTML = badgesHTML;

    let extraInfoHTML = '';
    let combinedInfo = [];
    
    // creator info
    if (n.creator) {
        const formattedCreator = n.creator.startsWith('@') ? n.creator : `@${n.creator}`;
        combinedInfo.push(formattedCreator);
    }
    
    // repository info
    if (n.link) {
        const safeUrl = n.link.startsWith('http') ? n.link : `https://${n.link}`;
        combinedInfo.push(`<a href="${safeUrl}" target="_blank" style="color: #38bdf8; text-decoration: none; border-bottom: 1px solid #38bdf8; padding-bottom: 1px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">Repository</a>`);
    }

    // add metadatas
    if (combinedInfo.length > 0) {
        extraInfoHTML = `
            <div class="time-row">
                <span class="time-label">Creator</span> 
                <span class="time-val">${combinedInfo.join(' ')}</span>
            </div>`;
    }

    // add timeline
    let devText = n.devStart || '-';
    if (n.devStart && n.activeStart) {
        devText += ` ~ ${n.activeStart}`;
    }
    let activeText = n.activeStart || '-';
    if (n.activeStart) {
        if (n.activeEnd) activeText += ` ~ ${n.activeEnd}`;
        else if (n.status === 'Active') activeText += ` ~ Now`;
    }
    document.getElementById('sp-timeline').innerHTML = `
        ${extraInfoHTML}
        <div class="time-row"><span class="time-label">Development</span> <span class="time-val">${devText}</span></div>
        <div class="time-row"><span class="time-label">Operation</span> <span class="time-val">${activeText}</span></div>
    `;

    // add description
    const formatText = (text) => text ? text.replace(/  /g, '\n') : '';
    document.getElementById('sp-techstack').innerHTML = formatText(n.techstack);
    document.getElementById('sp-description').innerHTML = formatText(n.description);

    if (panel) panel.classList.add('open');
}

// side panel close
window.closePanel = function() { 
    if (panel) panel.classList.remove('open'); 
}

// start page
window.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('resize', () => requestAnimationFrame(drawEdges));