document.getElementById('searchBtn').addEventListener('click', async () => {
  const name = document.getElementById('pokemonName').value.trim();
  const container = document.getElementById('result');
  
  if (!name) {
    container.innerHTML = `
      <div class="pokemon-not-found">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" class="empty-pokeball">
        <p>Veuillez entrer le nom d'un Pokémon pour commencer votre recherche</p>
      </div>
    `;
    return;
  }
  
  // Afficher un état de chargement avec animation
  container.innerHTML = `
    <div class="loading">
      <div class="pokeball-loader">
        <div class="pokeball-loader-inner"></div>
      </div>
      <p class="loading-text">Recherche de <span class="highlight">${name}</span>...</p>
    </div>
  `;
  
  try {
    const res = await window.electronAPI.getPokemon(name);

    if (res.error) {
      container.innerHTML = `
        <div class="error-container">
          <div class="error-icon">❌</div>
          <h3 class="error-title">Pokémon non trouvé</h3>
          <p class="error-message">${res.error}</p>
          <p class="error-suggestion">Vérifiez l'orthographe ou essayez un autre Pokémon</p>
        </div>`;
    } else {
      // Extraire les types et les formater avec des couleurs spécifiques
      const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
      };
      
      const types = res.types.map(type => {
        const bgColor = typeColors[type.toLowerCase()] || '#A8A878';
        return `<span class="type-badge" style="background-color: ${bgColor}">${type}</span>`;
      }).join('');

      // Calculer les statistiques pour la barre de progression
      const statsHTML = [];
      if (res.height) {
        statsHTML.push(`
          <div class="stat-row">
            <span class="stat-label">Taille</span>
            <span class="stat-value">${res.height/10} m</span>
          </div>
        `);
      }
      
      if (res.weight) {
        statsHTML.push(`
          <div class="stat-row">
            <span class="stat-label">Poids</span>
            <span class="stat-value">${res.weight/10} kg</span>
          </div>
        `);
      }

      // Générer un dégradé basé sur les types du Pokémon
      const typeColorValues = res.types.map(type => typeColors[type.toLowerCase()] || '#A8A878');
      const gradientColors = typeColorValues.length > 1 
        ? `linear-gradient(135deg, ${typeColorValues.join(', ')})`
        : typeColorValues[0];

      container.innerHTML = `
        <div class="pokemon-card">
          <div class="pokemon-card-header" style="background: ${gradientColors}">
            <div class="pokemon-id">#${res.id || '???'}</div>
            <h2 class="pokemon-name">${res.name.toUpperCase()}</h2>
            <div class="pokemon-types">${types}</div>
          </div>
          
          <div class="pokemon-card-body">
            <div class="pokemon-image-container">
              <img src="${res.sprite}" alt="${res.name}" class="pokemon-image">
              <div class="pokemon-image-shadow"></div>
            </div>
            
            <div class="pokemon-info">
              <h3 class="info-title">Informations</h3>
              <div class="pokemon-stats">
                <div class="stat-row">
                  <span class="stat-label">Type(s)</span>
                  <span class="stat-value">${res.types.join(', ')}</span>
                </div>
                ${statsHTML.join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Erreur</h3>
        <p class="error-message">Une erreur est survenue lors de la recherche</p>
        <p class="error-suggestion">Veuillez réessayer plus tard</p>
      </div>`;
  }
});

// Permettre la recherche avec la touche Entrée
document.getElementById('pokemonName').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

// Ajout des styles dynamiques
const style = document.createElement('style');
style.textContent = `
  .pokemon-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 2rem;
  }

  .pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  .pokemon-card-header {
    padding: 2rem;
    position: relative;
    color: white;
    text-align: center;
  }

  .pokemon-id {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
    opacity: 0.8;
  }

  .pokemon-name {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pokemon-types {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .type-badge {
    padding: 0.5rem 1rem;
    border-radius: 50px;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: capitalize;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pokemon-card-body {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .pokemon-image-container {
    position: relative;
    margin: -4rem auto 1rem;
    width: 200px;
    height: 200px;
    z-index: 10;
  }

  .pokemon-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
    z-index: 2;
    position: relative;
  }

  .pokemon-image:hover {
    transform: scale(1.1) rotate(5deg);
  }

  .pokemon-image-shadow {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 20px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    z-index: 1;
  }

  .info-title {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f0f2f5;
  }

  .pokemon-info {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .pokemon-stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .stat-label {
    color: #718096;
    font-weight: 600;
  }

  .stat-value {
    color: #2d3748;
    font-weight: 700;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .pokeball-loader {
    width: 60px;
    height: 60px;
    background: linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 50%, #ff5350 50%, #ff5350 100%);
    border-radius: 50%;
    border: 4px solid #2d3748;
    position: relative;
    animation: shake 1.25s cubic-bezier(.36,.07,.19,.97) infinite;
    transform-origin: center center;
  }

  .pokeball-loader::before {
    content: '';
    position: absolute;
    top: calc(50% - 2px);
    left: 0;
    width: 100%;
    height: 4px;
    background: #2d3748;
  }

  .pokeball-loader-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: #f5f5f5;
    border: 3px solid #2d3748;
    border-radius: 50%;
  }

  @keyframes shake {
    0% { transform: rotate(-10deg); }
    20% { transform: rotate(10deg); }
    30% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
    65% { transform: rotate(-10deg); }
    85% { transform: rotate(10deg); }
    100% { transform: rotate(-10deg); }
  }

  .loading-text {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    color: #718096;
  }

  .highlight {
    color: #3761a8;
    font-weight: 600;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ff5350;
  }

  .error-title {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .error-message {
    font-size: 1.1rem;
    color: #718096;
    margin-bottom: 1rem;
  }

  .error-suggestion {
    font-size: 0.9rem;
    color: #a0aec0;
  }

  .pokemon-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .empty-pokeball {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }
`;

document.head.appendChild(style);
