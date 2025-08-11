import React, { type ReactNode } from 'react';

interface SkillTabsProps {
  children: ReactNode;
}

const SkillTabs: React.FC<SkillTabsProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default SkillTabs;



