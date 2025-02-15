export const errorHandler = (err, req, res, next) => {
  console.error("Error 52:", err);

  if (err.status && err.message) {
    return res.status(err.status).send({
      error: err.message,
    });
  }

  if (err.errors && err.errors[0]) {
    return res.status(400).send({
      error: err.errors[0].message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(422).json({
      error: err.message,
    });
  }

  res.status(500).send({
    error: err.message || "An unexpected error occurred.",
  });
};
