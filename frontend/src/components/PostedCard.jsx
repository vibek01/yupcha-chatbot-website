import { Motion } from 'solid-motionone';

export default function PostedCard(props) {
  const { tweet } = props;
  const title = tweet.topic.split(' ').slice(0, 5).join(' ');
  const postedDate = new Date(tweet.posted_at || tweet.created_at);
  let cardRef;

  const handleMouseMove = (e) => {
    if (!cardRef) return;
    
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.style.setProperty("--mouse-x", `${x}px`);
    cardRef.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Motion.div
      ref={cardRef}
      class="card posted-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div class="card-content">
        <div class="card-content-background">
          <div class="card-header">
            <div class="card-title">{title}</div>
            <div class="status-chip posted-chip">Posted</div>
          </div>

          <div class="card-content-inner">
            <p class="posted-content">{tweet.content}</p>
          </div>

          <div class="card-footer">
            <div>Posted: {postedDate.toLocaleDateString()}</div>
            <div>
              {postedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}