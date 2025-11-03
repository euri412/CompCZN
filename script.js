// Team Builder Logic
class TeamBuilder {
    constructor() {
        this.data = null;
        this.selectedTeam = {
            dps: null,
            sub: null,
            healer: null
        };
        this.currentSlot = null;

        // Characters that need horizontal flip when on the left (sub position)
        // Add character names here that need to be flipped
        this.flipOnLeft = [
            // 'Hugo', 'Kayro', etc. - to be configured based on character poses
        ];

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data. Please reload the page.');
        }
    }

    setupEventListeners() {
        // Slot clicks
        document.getElementById('slot-dps').addEventListener('click', () => {
            if (!this.selectedTeam.dps) {
                this.openPanel('dps');
            } else {
                this.clearSlot('dps');
            }
        });

        document.getElementById('slot-sub').addEventListener('click', () => {
            if (!this.selectedTeam.dps) return;
            if (!this.selectedTeam.sub) {
                this.openPanel('sub');
            } else {
                this.clearSlot('sub');
            }
        });

        document.getElementById('slot-healer').addEventListener('click', () => {
            if (!this.selectedTeam.sub) return;
            if (!this.selectedTeam.healer) {
                this.openPanel('healer');
            } else {
                this.clearSlot('healer');
            }
        });

        // Panel controls
        document.getElementById('close-panel').addEventListener('click', () => {
            this.closePanel();
        });

        // Reset button (eliminado del HTML, pero mantenemos la función por si acaso)
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetTeam();
            });
        }

        // Close panel on outside click
        document.getElementById('character-panel').addEventListener('click', (e) => {
            if (e.target.id === 'character-panel') {
                this.closePanel();
            }
        });
    }

    openPanel(slotType) {
        this.currentSlot = slotType;
        const panel = document.getElementById('character-panel');
        const title = document.getElementById('panel-title');

        // Set title
        const titles = {
            dps: 'Select a DPS',
            sub: 'Select a Sub DPS / Support',
            healer: 'Select a Healer / Support'
        };
        title.textContent = titles[slotType];

        // Get available characters
        const availableCharacters = this.getAvailableCharacters(slotType);
        this.renderCharacters(availableCharacters);

        // Show panel
        panel.classList.add('active');
    }

    closePanel() {
        const panel = document.getElementById('character-panel');
        panel.classList.remove('active');
        this.currentSlot = null;
    }

    getAvailableCharacters(slotType) {
        if (!this.data) return [];

        switch (slotType) {
            case 'dps':
                return this.data.characters.filter(c => c.role === 'dps');

            case 'sub':
                const dps = this.selectedTeam.dps;
                if (!dps) return [];

                const compatibility = this.data.compatibility[dps.name];
                if (!compatibility || !compatibility.sub_candidates) return [];

                return this.data.characters.filter(c =>
                    compatibility.sub_candidates.includes(c.name) &&
                    c.name !== dps.name
                );

            case 'healer':
                const selectedDps = this.selectedTeam.dps;
                const selectedSub = this.selectedTeam.sub;
                if (!selectedDps || !selectedSub) return [];

                let healerCandidates = new Set();

                // Get healer candidates from DPS
                const dpsCompatibility = this.data.compatibility[selectedDps.name];
                if (dpsCompatibility && dpsCompatibility.healer_candidates) {
                    dpsCompatibility.healer_candidates.forEach(h => healerCandidates.add(h));
                }

                // If SUB has healer support, add those
                const subCompatibility = this.data.compatibility[selectedSub.name];
                if (subCompatibility && subCompatibility.can_support) {
                    // Check if any healers can support this sub
                    this.data.characters.filter(c => c.role === 'healer').forEach(healer => {
                        const healerComp = this.data.compatibility[healer.name];
                        if (healerComp && healerComp.can_support &&
                            healerComp.can_support.includes(selectedSub.name)) {
                            healerCandidates.add(healer.name);
                        }
                    });
                }

                // If no specific healers, show universal healers
                if (healerCandidates.size === 0) {
                    this.data.universal_healers.forEach(h => healerCandidates.add(h));
                }

                return this.data.characters.filter(c =>
                    c.role === 'healer' &&
                    healerCandidates.has(c.name)
                );

            default:
                return [];
        }
    }

    renderCharacters(characters) {
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';

        characters.forEach((character, index) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.style.setProperty('--index', index);

            // Create image path for selection grid (square images)
            const imageName = character.name.toLowerCase().replace(/\s+/g, '_');
            const imagePath = `assets/select/${imageName}.png`;

            // Border color based on affinity
            const borderColor = character.affinity || '#666';

            card.innerHTML = `
                <img src="${imagePath}" alt="${character.name}"
                     style="border-color: ${borderColor}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23fff%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2220%22%3E${character.name.charAt(0)}%3C/text%3E%3C/svg%3E'">
                <div class="name">${character.name}</div>
                <div class="role">${character.role}</div>
            `;

            card.addEventListener('click', () => {
                this.selectCharacter(character);
            });

            grid.appendChild(card);
        });
    }

    selectCharacter(character) {
        if (!this.currentSlot) return;

        // If selecting sub and it causes healer to be invalid, clear healer
        if (this.currentSlot === 'sub' && this.selectedTeam.healer) {
            const tempTeam = { ...this.selectedTeam, sub: character };
            const availableHealers = this.getAvailableCharactersForTempTeam(tempTeam);
            if (!availableHealers.find(h => h.name === this.selectedTeam.healer.name)) {
                this.selectedTeam.healer = null;
            }
        }

        this.selectedTeam[this.currentSlot] = character;
        this.closePanel();
        this.updateUI();
        this.updateSummary();
        this.updateCompositionVisual();
    }

    getAvailableCharactersForTempTeam(tempTeam) {
        const selectedDps = tempTeam.dps;
        const selectedSub = tempTeam.sub;
        if (!selectedDps || !selectedSub) return [];

        let healerCandidates = new Set();

        const dpsCompatibility = this.data.compatibility[selectedDps.name];
        if (dpsCompatibility && dpsCompatibility.healer_candidates) {
            dpsCompatibility.healer_candidates.forEach(h => healerCandidates.add(h));
        }

        const subCompatibility = this.data.compatibility[selectedSub.name];
        if (subCompatibility && subCompatibility.can_support) {
            this.data.characters.filter(c => c.role === 'healer').forEach(healer => {
                const healerComp = this.data.compatibility[healer.name];
                if (healerComp && healerComp.can_support &&
                    healerComp.can_support.includes(selectedSub.name)) {
                    healerCandidates.add(healer.name);
                }
            });
        }

        if (healerCandidates.size === 0) {
            this.data.universal_healers.forEach(h => healerCandidates.add(h));
        }

        return this.data.characters.filter(c =>
            c.role === 'healer' &&
            healerCandidates.has(c.name)
        );
    }

    clearSlot(slotType) {
        this.selectedTeam[slotType] = null;

        // Clear subsequent slots
        if (slotType === 'dps') {
            this.selectedTeam.sub = null;
            this.selectedTeam.healer = null;
        } else if (slotType === 'sub') {
            this.selectedTeam.healer = null;
        }

        this.updateUI();
        this.updateSummary();
        this.updateCompositionVisual();
    }

    resetTeam() {
        this.selectedTeam = {
            dps: null,
            sub: null,
            healer: null
        };
        this.updateUI();
        this.updateSummary();
        this.updateCompositionVisual();
    }

    updateUI() {
        this.updateSlot('dps');
        this.updateSlot('sub');
        this.updateSlot('healer');
    }

    updateSlot(slotType) {
        const slot = document.getElementById(`slot-${slotType}`);
        const content = slot.querySelector('.slot-content');
        const character = this.selectedTeam[slotType];

        // Update active state
        if (character) {
            slot.classList.add('active');
        } else {
            slot.classList.remove('active');
        }

        if (character) {
            const imageName = character.name.toLowerCase().replace(/\s+/g, '_');
            const imagePath = `assets/select/${imageName}.png`;
            const borderColor = character.affinity || '#666';

            content.innerHTML = `
                <div class="selected-character">
                    <img src="${imagePath}"
                         alt="${character.name}"
                         class="character-avatar"
                         style="border-color: ${borderColor}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23fff%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2230%22%3E${character.name.charAt(0)}%3C/text%3E%3C/svg%3E'">
                    <span class="character-name">${character.name}</span>
                    <span class="character-role">${character.role}</span>
                </div>
            `;
        } else {
            const emptyMessages = {
                dps: { icon: '⚔️', text: 'Select DPS', locked: false },
                sub: {
                    icon: this.selectedTeam.dps ? '🎯' : '🔒',
                    text: this.selectedTeam.dps ? 'Select Sub DPS' : 'Select DPS first',
                    locked: !this.selectedTeam.dps
                },
                healer: {
                    icon: this.selectedTeam.sub ? '💚' : '🔒',
                    text: this.selectedTeam.sub ? 'Select Healer' : 'Select SUB first',
                    locked: !this.selectedTeam.sub
                }
            };

            const message = emptyMessages[slotType];
            content.innerHTML = `
                <div class="empty-slot ${message.locked ? 'locked' : ''}">
                    <span class="empty-icon">${message.icon}</span>
                    <span>${message.text}</span>
                </div>
            `;
        }
    }

    updateSummary() {
        // Update DPS
        const dpsSummary = document.getElementById('summary-dps');
        const dpsName = dpsSummary.querySelector('.member-name');
        if (this.selectedTeam.dps) {
            dpsName.textContent = this.selectedTeam.dps.name;
            dpsSummary.classList.add('filled');
        } else {
            dpsName.textContent = '—';
            dpsSummary.classList.remove('filled');
        }

        // Update Sub
        const subSummary = document.getElementById('summary-sub');
        const subName = subSummary.querySelector('.member-name');
        if (this.selectedTeam.sub) {
            subName.textContent = this.selectedTeam.sub.name;
            subSummary.classList.add('filled');
        } else {
            subName.textContent = '—';
            subSummary.classList.remove('filled');
        }

        // Update Healer
        const healerSummary = document.getElementById('summary-healer');
        const healerName = healerSummary.querySelector('.member-name');
        if (this.selectedTeam.healer) {
            healerName.textContent = this.selectedTeam.healer.name;
            healerSummary.classList.add('filled');
        } else {
            healerName.textContent = '—';
            healerSummary.classList.remove('filled');
        }
    }

    updateCompositionVisual() {
        const emptyMessage = document.getElementById('composition-empty');
        const visualDps = document.getElementById('visual-dps');
        const visualSub = document.getElementById('visual-sub');
        const visualHealer = document.getElementById('visual-healer');

        // Show/hide empty message
        const hasAnyCharacter = this.selectedTeam.dps || this.selectedTeam.sub || this.selectedTeam.healer;
        emptyMessage.style.display = hasAnyCharacter ? 'none' : 'block';

        // Update DPS (center)
        this.updateVisualPosition(visualDps, this.selectedTeam.dps, 'dps');

        // Update Sub DPS (left - intercambiado con healer)
        this.updateVisualPosition(visualSub, this.selectedTeam.sub, 'sub');

        // Update Healer (right - intercambiado con sub)
        this.updateVisualPosition(visualHealer, this.selectedTeam.healer, 'healer');
    }

    updateVisualPosition(element, character, position) {
        if (character) {
            const imageName = character.name.toLowerCase().replace(/\s+/g, '_');
            const imagePath = `assets/characters/${imageName}.png`;

            // Check if character needs flip when on left (sub position now)
            const needsFlip = position === 'sub' && this.flipOnLeft.includes(character.name);

            element.innerHTML = `
                <img src="${imagePath}"
                     alt="${character.name}"
                     onerror="this.style.display='none'">
            `;

            // Add flip class if needed
            if (needsFlip) {
                element.classList.add('flip');
            } else {
                element.classList.remove('flip');
            }

            // Activate with animation
            setTimeout(() => {
                element.classList.add('active');
            }, 100);
        } else {
            element.classList.remove('active', 'flip');
            setTimeout(() => {
                element.innerHTML = '';
            }, 600); // Wait for exit animation
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TeamBuilder();
    });
} else {
    new TeamBuilder();
}
