// src/app/shared/models/skill.model.ts

export interface SkillGroup {
  label: string;
  skills: string[];
}

/** Shape stored in Firestore at settings/skills */
export interface SkillsDoc {
  groups: SkillGroup[];
}
