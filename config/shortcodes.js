import supportLevels from "../src/_data/support-levels.js";

const support = (supportLevel) => {
  const tagClass = `tag tag--${supportLevel} spectrum-Body spectrum-Body--sizeXS`;

  return `<span class="${tagClass}">${supportLevels[supportLevel]}</span>`;
};

const year = () => `${new Date().getFullYear()}`;

export default {
  support,
  year,
};
