import skills from '../../data/techSkills';

function SkillChip({ name }) {
  const skill = skills.find(s => s.name === name);
  return (
    <span className="chip">
      {skill && <img src={skill.img} alt="" />}
      <span>{name}</span>
    </span>
  );
}

export default SkillChip;
