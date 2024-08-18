interface Strapi {
    [key: string]: any
}

async function gradeToGroup(grade) {
    const gradeInt = parseInt(grade)
    // const groups = await strapi.entityService.findMany('api::group.group')
    const groups = (strapi as Strapi).gameData.groups
    for (const group of groups) {
        const groupGrades = group.grades.split(',').map(grade => parseInt(grade))
        if (groupGrades.includes(gradeInt)) return group
    }
}

export default gradeToGroup