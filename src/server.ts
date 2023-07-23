import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminRoute } from './routes/admin.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new AdminRoute()]);

app.listen();
