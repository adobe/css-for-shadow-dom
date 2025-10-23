---
title: "@property"
description: "Allows for property type checking and constraining, setting default values, and defining whether or not a custom property can inherit values. "
support: "acceptable"
baseline: "newly"
functional: "critical"
usage: "light-dom-priority"
---

Per current browser support, `@property` definitions can only exist in light DOM. However, applied defined properties in shadow DOM respect those definitions. This makes them usable for applications that are able to host a global stylesheet and don’t require scoped definitions.
