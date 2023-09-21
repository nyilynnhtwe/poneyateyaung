type responseInterace<T> = {
  statusCode: number;
  message: string;
  devMessage: string;
  body: T;
};

export const CustomResponser = ({
  statusCode,
  message,
  devMessage,
  body,
}: responseInterace<typeof body>) => {
  return {
    success: statusCode >= 200 && statusCode <= 300 ? true : false,
    message: message,
    devMessage: devMessage,
    numOfResults: body ? body.length : null,
    result: body ? body : null,
  };
};
