import { errors } from "@strapi/utils"
const { ApplicationError } = errors


export default async (ctx, config, { strapi }) => {
    const { data } = ctx.request.body
    for (let key in data) {
        if (!data[key]) throw new ApplicationError(`Missing ${key} data!`)
    }

    const allowedGrades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const grade = parseInt(data.grade)

    if (!allowedGrades.includes(grade)) throw new ApplicationError(`Invalid grade data!`)

    const { email, phone } = data
    const [user] = await strapi.entityService.findMany('plugin::users-permissions.user', {
        limit: 1,
        filters: { email }
    })

    if (user) {
        const isCorrectedPassword = await strapi.plugin('users-permissions').services.user.validatePassword(phone, user.password)
        if (!isCorrectedPassword) throw new ApplicationError('Incorrect phone number!')
        
        ctx.request.body.userID = user.id
        ctx.request.body.data.grade = user.grade
    }

    return true;
};