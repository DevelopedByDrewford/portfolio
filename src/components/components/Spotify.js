function Spotify() {
  return (
    <div className="spotify">
      <div className="spotify__label">Now playing</div>
      <iframe
        title="Spotify playlist"
        style={{ borderRadius: 10 }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1E399bEzHqzh86?utm_source=generator&theme=0"
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

export default Spotify;
