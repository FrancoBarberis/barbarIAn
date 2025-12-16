
// src/components/AgentPreview/AgentPreview.tsx
import React from "react";
import styles from "./AgentPreview.module.css";
import AgentIdleIMG from "../../assets/idle.jpg";
import AgentThinkingIMG from "../../assets/thinking.jpg";
import { useUIStore } from "../../store/uiStore";

const AgentPreview: React.FC = () => {
  const thinking = useUIStore((s) => s.thinking);
  return (
    <div className={styles.AgentPreview}>
      <h2 className={styles.title}>Barbar<span>IA</span>n</h2>
      <img
        src={(thinking ? AgentThinkingIMG : AgentIdleIMG) as string}
        alt={thinking ? "Agente pensando" : "Agente inactivo"}
        className={styles.image}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default AgentPreview;
