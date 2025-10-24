// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";

const features = [
  { title: "Real-time Collaboration", description: "Work with your team simultaneously on a shared canvas.", color: "bg-indigo-100" },
  { title: "Drawing Tools", description: "Draw, sketch, and annotate with versatile tools.", color: "bg-pink-100" },
  { title: "Cloud Saving", description: "Access your boards anytime with secure cloud storage.", color: "bg-yellow-100" },
  { title: "Templates", description: "Start quickly with pre-made templates for brainstorming.", color: "bg-green-100" },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-indigo-900">The Canvas for Every Team.</h1>
          <p className="text-gray-700 text-lg">Brainstorm ideas, collaborate in real-time, and turn concepts into action with our interactive whiteboard.</p>
          <div className="flex space-x-4">
            <Link to="/signup"><Button text="Get Started" color="gradient" /></Link>
            <Link to="/signup"><Button text="Sign Up" color="pink" /></Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?fit=crop&w=800&q=80"
            alt="Brainstorm hero"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} color={f.color} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
