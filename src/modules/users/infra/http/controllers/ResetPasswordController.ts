import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

class ForgotController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password,
    });

    return response.status(204).send();
  }
}

export default ForgotController;
