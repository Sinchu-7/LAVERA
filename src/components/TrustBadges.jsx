import { Sparkles, ShieldCheck, HeartHandshake, PackageCheck } from "lucide-react";
import "../styles/TrustBadges.css";

const badges = [
  {
    icon: Sparkles,
    title: "100% Clean & Vegan",
    desc: "Botanical extracts with zero parabens or toxins",
  },
  {
    icon: ShieldCheck,
    title: "Dermatologist Tested",
    desc: "Clinically proven gentle for sensitive skin",
  },
  {
    icon: HeartHandshake,
    title: "Cruelty-Free Always",
    desc: "Ethically formulated with love for all beings",
  },
  {
    icon: PackageCheck,
    title: "Free Luxury Delivery",
    desc: "Complimentary priority shipping on orders over ₹999",
  },
];

function TrustBadges() {
  return (
    <section className="trust-badges-section">
      <div className="trust-badges-grid">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div className="trust-badge-card" key={idx}>
              <div className="trust-badge-icon">
                <Icon size={24} />
              </div>
              <div className="trust-badge-text">
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustBadges;
