export interface Stat {
  name: string;
  value: string;
}

export interface Skill {
  name: string;
  description: string;
  cooldown: string;
}

export interface CharacterClass {
  name: string;
  description: string;
  quote: string;
  stats: Stat[];
  basicSkills: Skill[];
  tacticalSkills: Skill[];
  ultimateSkill: Skill[];
}
