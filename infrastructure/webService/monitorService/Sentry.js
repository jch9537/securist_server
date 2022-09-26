const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

module.exports = class {
    constructor() {
        this.Sentry = Sentry;
        this.Tracing = Tracing;
    }
    sentryInit(app) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }), // HTTP 호출 추적 사용
                new Tracing.Integrations.Express({ app }), // Express.js 미들웨어 추적 활성화
                // new Tracing.Integrations.Mysql({
                //     useMySql: true,
                // }),
            ],
            tracesSampleRate: 1.0, // 정보 가져오는 수준 : 0 - 1.0 까지 (0~100%)
        });
    }
};
