import { margin } from "./layout";
import makeIndicator from "./indicator";
import { pitchRange } from "./scale";
import makeScroll from "./scroll";
import makePage from "./page";

export default function() {
  const svg = d3.select("svg.main");

  const page = makePage(svg);

  // Create hidden line to ensure page fits margins
  page.element
    .append("line")
    .attr("y2", margin.top + pitchRange + margin.top) // TODO
    .style("visibility", "hidden");

  const scoreGroup = makeScroll(page.element);
  scoreGroup.y(margin.top);

  const indicator = makeIndicator(page.element);

  return {
    svg,
    page,
    scoreGroup,
    indicator
  };
}
