import skills from "../../../data/techSkills"

function Skills() {

    const languages = ['Javascript', 'Typescript', 'Python', 'Groovy Script', 'PostgreSQL', 'HTML 5', 'CSS 3'];
    const webDev = ['Node.js', 'React.js', 'Preact', 'Next.js', 'Sassy CSS', 'Tailwind CSS', 'Netlify', 'Render']
    const tools = ['Git', 'AWS', 'Claude', 'Figma', 'Shopify', 'Magento', 'BigCommerce']

    const langArray = skills.filter(skill =>
      languages.includes(skill.name)
    );

    const webArray = skills.filter(skill => 
        webDev.includes(skill.name)
    );

    const toolsArray = skills.filter(skill => 
        tools.includes(skill.name)
    )

    return(
        <div className='skills'>


            Coding Languages
            <div className='skill-icon__container'>
                {langArray.map((codeObj) => {
                    return(
                        <a className='skill-icon' href={codeObj.link}  key={codeObj.id} target='_blank'>
                            <img src={codeObj.img} alt={codeObj.name} style={{width: `${codeObj.width}px`}}/>
                        </a>
                    )
                })}
            </div>

            Web Development
            <div className='skill-icon__container'>
                {webArray.map((devObj) => {
                    return(
                        <a className='skill-icon' href={devObj.link}  key={devObj.id} target='_blank'>
                            <img src={devObj.img} alt={devObj.name} style={{width: `${devObj.width}px`}}/>
                        </a>
                    )
                })}
            </div>

            Tools
            <div className='skill-icon__container'>
                {toolsArray.map((toolsObj) => {
                    return(
                        <a className='skill-icon' href={toolsObj.link}  key={toolsObj.id} target='_blank'>
                            <img src={toolsObj.img} alt={toolsObj.name} style={{width: `${toolsObj.width}px`}}/>
                        </a>
                    )
                })}
            </div>

        </div>
    )
}

export default Skills

 