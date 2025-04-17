import { AxiosError } from 'axios';

type ValidationErrors = {
  [key: string]: string[];
};

type ErrorResponse = {
  message: string;
  errors?: ValidationErrors;
};

export function getErrorMessage(error: unknown): { message: string; errors?: ValidationErrors } {
  if (error instanceof AxiosError && error.response) {
    const data = error.response.data as ErrorResponse;

    // Laravel のバリデーションエラー
    if (error.response.status === 422 && data.errors) {
      return {
        message: 'フォームの入力内容を確認してください',
        errors: data.errors,
      };
    }

    // その他のAPIエラー
    if (data.message) {
      return { message: data.message };
    }

    // HTTPステータスコードに基づくエラーメッセージ
    switch (error.response.status) {
      case 401:
        return { message: '認証エラー：ログインしてください' };
      case 403:
        return { message: 'この操作を行う権限がありません' };
      case 404:
        return { message: '要求されたリソースが見つかりませんでした' };
      case 500:
        return { message: 'サーバーエラーが発生しました。しばらく経ってからお試しください' };
      default:
        return { message: 'エラーが発生しました' };
    }
  }

  // その他のJavaScriptエラー
  if (error instanceof Error) {
    return { message: error.message };
  }

  // 未知のエラー
  return { message: '予期せぬエラーが発生しました' };
}
