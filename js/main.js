function outerWidth(el) {
  const style = getComputedStyle(el);

  return (
    el.getBoundingClientRect().width +
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight)
  );
}

const getDefaultFontSize = () => {
  const element = document.createElement("div");
  element.style.width = "1rem";
  element.style.display = "none";
  document.body.append(element);

  const widthMatch = window
    .getComputedStyle(element)
    .getPropertyValue("width")
    .match(/\d+/);

  element.remove();

  if (!widthMatch || widthMatch.length < 1) {
    return null;
  }

  const result = Number(widthMatch[0]);
  return !isNaN(result) ? result : null;
};

printDocumentWidth = (el) => {
  const docWidthDiv = document.querySelector(".document-width");
  if (!docWidthDiv) return;

  docWidthDiv.innerHTML = `Document width: ${outerWidth(el)}px`;
};

function getBreakpointActive(breakpointWidthStart, breakpointWidthEnd) {
  if (!breakpointWidthEnd) {
    breakpointWidthEnd = "1000rem"; // effectively no upper limit
  }
  let widthStart =
    parseInt(breakpointWidthStart?.trimEnd("rem")) * getDefaultFontSize();
  let widthEnd =
    parseInt(breakpointWidthEnd?.trimEnd("rem")) * getDefaultFontSize();
  let docWidth = outerWidth(document.body);
  if (docWidth >= widthStart && docWidth < widthEnd) {
    return true;
  }
  return false;
}

function printBreakpointInfo() {
  let breakpointInfo = {
    default: { text: "Default: ", value: "", active: false },
    medium: { text: "Medium: ", value: "", active: false },
    large: { text: "Large: ", value: "", active: false },
  };

  breakpointInfo.default.value = "0rem";

  breakpointInfo.medium.value = window
    .getComputedStyle(document.body)
    .getPropertyValue("--breakpoint-medium");

  breakpointInfo.large.value = window
    .getComputedStyle(document.body)
    .getPropertyValue("--breakpoint-large");

  breakpointInfo.default.active = getBreakpointActive(
    breakpointInfo.default.value,
    breakpointInfo.medium.value
  )
    ? "active"
    : "";

  breakpointInfo.medium.active = getBreakpointActive(
    breakpointInfo.medium.value,
    breakpointInfo.large.value
  )
    ? "active"
    : "";

  breakpointInfo.large.active = getBreakpointActive(
    breakpointInfo.large.value,
    null
  )
    ? "active"
    : "";

  const breakpointInfoDiv = document.querySelector(".breakpoint-info");
  if (!breakpointInfoDiv) return;

  let html =
    "<p>Resize the browser window to see how the layout adapts to different screen sizes.</p><ul>";
  for (const key in breakpointInfo) {
    html += `<li class='${breakpointInfo[key].active ? "active" : ""}'>${
      breakpointInfo[key].text
    } ${breakpointInfo[key].value}</li>`;
  }
  html += "</ul>";
  breakpointInfoDiv.innerHTML = html;
}

function ready() {
  printBreakpointInfo();
  window.addEventListener("resize", () => {
    printBreakpointInfo();
    printDocumentWidth(document.body);
  });
}

// this is required for the (not so) edge case where your script is loaded after the document has loaded
// https://developer.mozilla.org/en/docs/Web/API/Document/readyState
if (document.readyState !== "loading") {
  ready();
} else {
  // the document hasn't finished loading/parsing yet so let's add an event handler
  document.addEventListener("DOMContentLoaded", ready);
}
