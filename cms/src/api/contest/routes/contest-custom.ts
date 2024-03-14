
export default {
    routes: [
        {
            method: 'POST',
            path: '/contest/register',
            handler: 'contest.register',
            config: {
                policies: ['validate-user'],
            }
        }
    ]
}