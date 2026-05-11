const icons = ['🍰', '🧁', '🍩', '🍪', '🍞', '🥐', '🍓', '🍵', '🍮', '🥧', '🥨', '🥯'];
let tray = [];
let allTiles = [];

function initGame() {
    const board = document.getElementById('tileBoard');
    board.innerHTML = '';
    tray = [];
    allTiles = [];
    document.getElementById('tray').innerHTML = '';
    document.getElementById('gameOverlay').classList.add('hidden');

    let tempIcons = [];
    for(let i=0; i<20; i++) {
        const icon = icons[i % icons.length];
        tempIcons.push(icon, icon, icon);
    }
    tempIcons.sort(() => Math.random() - 0.5);

    for (let layer = 0; layer < 5; layer++) {
        const offset = layer * 12; 
        for (let i = 0; i < 12; i++) {
            if (tempIcons.length === 0) break;
            const icon = tempIcons.pop();
            const tile = createTile(icon, i, layer, offset);
            allTiles.push(tile);
            board.appendChild(tile.el);
        }
    }
    checkBlockage();
}

function createTile(icon, index, layer, offset) {
    const el = document.createElement('div');
   
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    el.className = "absolute w-20 h-20 bg-white rounded-3xl shadow-xl border-b-4 border-gray-100 flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95";
    
    const x = (col * 100) + 40 + (Math.random() * 20) + offset;
    const y = (row * 100) + 40 + (Math.random() * 20) + offset;
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.zIndex = layer;
    el.textContent = icon;

    const tileObj = { el, icon, layer, x, y, id: Math.random() };
    el.onclick = () => {
        if (el.classList.contains('locked')) {
          
            el.style.animation = "shake 0.2s";
            setTimeout(() => el.style.animation = "", 200);
            return;
        }
        handlePick(tileObj);
    };
    return tileObj;
}

function checkBlockage() {
    allTiles.forEach(t1 => {
       
        const isBlocked = allTiles.some(t2 => {
            return t2.layer > t1.layer && 
                   Math.abs(t2.x - t1.x) < 75 && 
                   Math.abs(t2.y - t1.y) < 75;
        });

        if (isBlocked) {
            t1.el.classList.add('locked', 'opacity-30', 'brightness-50', 'scale-90');
        } else {
            t1.el.classList.remove('locked', 'opacity-30', 'brightness-50', 'scale-90');
        }
    });
}

function handlePick(tile) {
    if (tray.length >= 7) return;

    allTiles = allTiles.filter(t => t.id !== tile.id);
    tile.el.remove();
    
    tray.push(tile.icon);
    tray.sort(); 
    
    renderTray();
    checkBlockage();
    
    const counts = {};
    tray.forEach(x => counts[x] = (counts[x] || 0) + 1);
    
    for (let icon in counts) {
        if (counts[icon] === 3) {
            setTimeout(() => {
                tray = tray.filter(t => t !== icon);
                renderTray();
                if (allTiles.length === 0) showStatus("YOU WON! 🏆", "Master Baker Status! Claim your free pastry.");
            }, 300);
        }
    }

    if (tray.length === 7) {
        const hasMatch = Object.values(counts).some(c => c === 3);
        if (!hasMatch) setTimeout(() => showStatus("TRAY FULL!", "No more space. The kitchen is closed!"), 400);
    }
}

function renderTray() {
    const trayEl = document.getElementById('tray');
    trayEl.innerHTML = '';
    tray.forEach(icon => {
        const slot = document.createElement('div');
        slot.className = "w-16 h-16 bg-white border border-pink-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm animate-bounce-short";
        slot.textContent = icon;
        trayEl.appendChild(slot);
    });
}

function showStatus(title, desc) {
    document.getElementById('statusTitle').textContent = title;
    document.getElementById('statusDesc').textContent = desc;
    document.getElementById('gameOverlay').classList.remove('hidden');
}

window.onload = initGame;