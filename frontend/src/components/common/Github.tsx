import { Github } from "lucide-react"

const GithubLinkProject: React.FC = () => {
    return (
    <a 
    href="https://github.com/kul-riya/viewphoria" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="absolute top-6 right-6 z-20 text-purple-300 hover:text-white transition-colors duration-300"
  >
    <Github size={32} />
  </a>
    );
}

export default GithubLinkProject;