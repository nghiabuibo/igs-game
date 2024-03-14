export default (plugin) => {
    plugin.controllers.user.apiToken = async (ctx) => {
        const [_, isAdmin, message] = await strapi.services['admin::auth'].checkCredentials(ctx.request.body)
        if (!isAdmin) return ctx.badRequest(message.message)

        const adminSettings = await strapi.entityService.findMany('api::admin-setting.admin-setting')
        if (!adminSettings?.apiToken) return ctx.badRequest('No API Token!')
        
        ctx.send({ jwt: adminSettings.apiToken })
    }

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/api-token',
        handler: 'user.apiToken',
    })
    return plugin
}