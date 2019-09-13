const requireRoot = require("app-root-path").require;
const { catMap } = requireRoot("render-utils");

const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "admin",
      status: "unlisted",
      options: "noop",
      modules: ["websockets"]
    };
  }

  render(data) {
    const works = data.collections.all
      .filter(w => ["score", "score-set", "movement"].includes(w.data.layout))
      .filter(w => w.data.status !== "unlisted");

    return `
      ${options()}
      ${catMap(work => `<button>${work.url}</button>`, works)}
    `;
  }
};