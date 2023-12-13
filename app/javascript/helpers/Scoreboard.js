class Scoreboard {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.scoreText = this.scene.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff'
    });
  }

  // =================================
  // Function to get the current score
  // ---------------------------------
  getScore() {
    return this.score;
  }

  // ===============================================
  // Function to update player score in the database
  // -----------------------------------------------
  async updatePlayerScoreInDB(playerId) {
    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const domain    = "https://cosmicdefender.jeremyd.net"    //window.GAME_API_PORT == 3002 ? "http://localhost:3002" : window.GAME_API_PORT
    const url       = `${domain}/api/v1/players/${playerId}/update_score`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ score: this.score })
      });
    } catch (error) {
      console.error('There was a problem updating the score:', error);
    }
  }

  // ================
  // update the score
  // ----------------
  async updateScore(points) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
export default Scoreboard;
