function showIcon(event, iconIds) {
  event.preventDefault();
  // console.log(event.target)
  const parent = event.target;
  if (!parent || !iconIds || iconIds.length == 0) {
    return;
  }

  let iconGroup = document.getElementById(parent.id + "_icon_group");
  if (!iconGroup) {
    iconGroup = document.createElement("div");
    iconGroup.id = parent.id + "_icon_group";
    parent.appendChild(iconGroup);
  }

  for (let iconId of iconIds) {
    if (document.getElementById(iconId + "_dup")) {
      return;
    }
    const icon = document.getElementById(iconId);
    if (!icon) {
      continue;
    }
    const dupIcon = icon.cloneNode(true);
    dupIcon.id = iconId + "_dup";
    dupIcon.className = "inline-icon icon";
    iconGroup.appendChild(dupIcon);
  }
}

function hideIcon(event) {
  event.preventDefault();
  parent = event.target;
  for (let child of parent.children) {
    const isIcon = child.className.indexOf("icon") > -1;
    if (isIcon) {
      parent.removeChild(child);
    }
  }
}

function createToolTip(parent) {
  const tooltip = document.createElement("span");
  tooltip.className = "tooltiptext";
  tooltip.id = "tooltip_" + parent.id;
  return tooltip;
}

function destroyToolTip(event) {
  event.preventDefault();
  const childToolTipId = "tooltip_" + event.target.id;
  const tooltipText = document.getElementById(childToolTipId);
  tooltipText.parentNode.removeChild(tooltipText);
}

function copyToClipboard(event, text) {
  event.preventDefault();
  // id is the parent tooltip element id
  const parent_tooltip = document.getElementById(event.target.id);
  navigator.clipboard.writeText(text);
  // create children tooltip element
  const tooltip = createToolTip(parent_tooltip);
  tooltip.innerHTML = "Copied: " + text;
  parent_tooltip.appendChild(tooltip);
  // attach event listener to destroy tooltip to only fire once
  parent_tooltip.addEventListener(
    "mouseout",
    function (event) {
      destroyToolTip(event);
    },
    {
      once: true,
    }
  );
}

// document.getElementById("signOut").addEventListener("click", async () => {
//     await signOutRedirect();
// });
