// src/components/FeatureCard.jsx
const FeatureCard = ({ title, description, color = "bg-indigo-100" }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow hover:shadow-lg transition`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default FeatureCard;
