const button = (content, href, btnSize, btnType) => {
  const type = btnType || "secondary";
  const size = btnSize || "M";
  const classes = `spectrum-Button spectrum-Button--fill spectrum-Button--${type} spectrum-Button--size${size}`;
  const label = `<span class="spectrum-Button-label">${content}</span>`;

  if (href != "") {
    return `<a href="${href}" class="${classes}">${label}</a>`;
  } else {
    return `<button class="${classes}">${label}</button>`;
  }
};

export default {
  button,
};
