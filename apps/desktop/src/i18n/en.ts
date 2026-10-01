Warning: truncated output (original token count: 68231)
Total output lines: 5726

import { FIELD_DESCRIPTIONS, FIELD_LABELS } from '@/app/settings/constants'

import type { Translations } from './types'

export const en: Translations = {
  externalOpenFailed: {
    title: 'Couldn’t open this link',
    message: 'No browser is registered to open this address. Copy the link and open it manually.',
    copyUrl: 'Copy link',
    close: 'Close',
    missing: {
      title: 'File not found',
      message: 'This file does not exist — it may have been deleted or moved, or it lives on another machine.'
    }
  },
  sharedMetrics: {
    consentTitle: 'Help improve Hermes?',
    consentBody:
      'Shared metrics contain only bounded counters. Never prompts, files, paths or error text. Collection is local. Sending them to Nous is a separate opt-in.',
    whatIsCollected: 'What is collected',
    collectedIntro: 'Only bounded counters:',
    collectedActivity: 'Activity, session length, outcomes and error classes',
    collectedModels: 'Model routes and token totals',
    collectedNames: 'Built-in tool, command and catalog names',
    collectedMilestones: 'Bucketed setup counts',
    collectedReliability: 'Update results and timing, crashes, startup and reply speed, messaging-platform health',
    collectedUsage:
      'How Hermes gets used: agent accuracy and efficiency (edit matches, loops, recoveries, tokens and tool calls per task, cache breaks), active time per surface and Desktop mode, which app areas, actions and settings are used, closed quickly or switched off, and provider setup outcomes',
    collectedMachine:
      'Coarse machine facts: RAM range, GPU type, Hermes version age and release channel, updates behind, whether a local model server is used',
    installId:
      'Sending uploads each daily package to the Nous telemetry service. Packages carry this profile’s install ID: a stable random UUID with no personal information, reset by deleting the shared-metrics directory.',
    consentWindow:
      'Only packages whose entire collection period falls inside a recorded consent window are ever sent — data from before you opt in, or from any gap while sending was off, stays on this machine. Sending can be turned off again at any time.',
    readDocs: 'Read the full details',
    share: 'Collect and send to Nous',
    local: 'Collect locally only',
    off: 'No thanks',
    changeLater: 'You can change this any time in Settings → Safety.',
    saveFailed: 'Couldn’t save your choice',
    collectLabel: 'Collect usage stats',
    collectDesc: 'Bounded counters kept on this device. Never prompts, files, paths or error text.',
    sendLabel: 'Send usage stats to Nous',
    sendDesc:
      'Upload each daily package to the Nous telemetry service. Only data from inside a consent window is sent. Needs collection on.',
    unavailable: 'Update the Hermes backend to change this setting.',
    stripBody: 'Bounded counters only, never prompts or files.',
    stripChoices: { share: 'Send to Nous', local: 'Local only', off: 'No thanks' },
    stripDetails: 'Details'
  },
  // English editorial copy stays in the shipped JSONL; other locales override it.
  intro: { stock: {}, custom: () => [] },
  catalog: {
    add: 'Add',
    added: 'Added',
    discover: 'Discover',
    featured: 'Featured',
    explorePlugins: 'Explore plugins',
    exploreSkills: 'Explore skills',
    mostStarred: 'Most starred',
    newest: 'Newest',
    recentlyUpdated: 'Recently updated',
    alphabetical: 'Name',
    sortBy: 'Sort by',
    seeAll: 'See all',
    related: 'More like this',
    tags: 'Tags',
    screenshots: 'Screenshots',
    listView: 'List view',
    cardView: 'Card view',
    installTitle: (name: string) => `Install “${name}”?`,
    installDescription: 'This skill will be available in new sessions. Only install sources you trust.',
    installTo: 'Install to',
    thisComputer: 'This computer',
    installing: 'Installing…',
    installComplete: (name: string) => `“${name}” installed`,
    destinationChanged: 'The destination changed. Close this dialog and open the install link again.',
    installed: 'Installed',
    searchSkills: 'Search skills',
    searchPlugins: 'Search plugins',
    allSources: 'All sources',
    allCategories: 'All categories',
    about: 'About',
    author: 'Author',
    source: 'Source',
    category: 'Category',
    version: 'Version',
    platforms: 'Platforms',
    requires: 'Requires',
    tools: 'Tools',
    hooks: 'Hooks',
    middleware: 'Middleware',
    commands: 'Commands',
    license: 'License',
    addedDate: 'Added',
    updatedDate: 'Updated',
    repository: 'Repository',
    documentation: 'Documentation',
    noResults: 'No matches',
    tryAnother: 'Try another search or clear your filters.',
    clearFilters: 'Clear filters',
    filters: 'Filters',
    loadFailed: 'Could not load the catalog',
    retry: 'Try again',
    more: 'Show more',
    pinned: 'Reviewed commit',
    snapshotHint: 'From the Hermes catalog. Browsing never contacts source repositories.',
    installHint: 'Review the source before installing. Changes apply to new sessions.',
    results: (count: number) => `${count.toLocaleString()} result${count === 1 ? '' : 's'}`,
    back: 'Back to results'
  },
  connectors: {
    title: 'Connect your apps',
    connect: 'Connect',
    skip: 'Not now',
    cancel: 'Stop waiting',
    retry: 'Try again',
    grant: 'Reconnect',
    connected: 'Connected',
    checking: 'Checking your apps…',
    notConnected: 'Not connected',
    skipped: 'Skipped',
    disabled: 'Unavailable',
    failed: 'Could not connect',
    needsAuth: 'Access expired',
    opening: 'Opening sign-in…',
    waiting: 'Waiting for your browser…',
    timeout: 'Still waiting for authorization.',
    refresh: 'Refresh status',
    connectError: 'Could not start authorization. Try again.',
    connectErrorFor: (app: string) => `Could not start authorization for ${app}.`,
    unavailable: 'Connectors are unavailable for this session.',
    ownerMissing: 'Reopen this conversation to manage its connections.',
    search: 'Find an app',
    empty: 'No matching apps',
    disclaimer: 'Connecting is optional. Only authorize the apps you want Hermes to use.',
    execution: 'Connector tools',
    setup: server => `Set up ${server}`,
    openInBrowser: 'Open in browser',
    setupCancel: 'Cancel',
    authorizedToolsUnavailable: 'Authorized. Tools unavailable.',
    required: 'Required'
  },

  // `connectors.*` above stays the onboarding and chat vocabulary; these are the page's own, and the two are not shared.
  connectorsPage: {
    title: 'Connectors',
    searchPlaceholder: (count: number) => `Search ${count} apps`,
    filterCategory: 'Category',
    categoryAll: 'All categories',
    uncategorised: 'Uncategorised',

    residencyLocal: 'On this device',

    segment: {
      all: 'All',
      available: 'Available',
      connected: 'Connected',
      off: 'Turned off'
    },

    group: {
      connected: 'Connected',
      connectedNote: 'Broken connections first.',
      available: 'Available',
      off: 'Turned off',
      offNote: 'Sign-ins are kept.'
    },

    card: {
      kindManaged: 'Managed',
      kindCatalog: 'MCP · Catalog',
      kindCustom: 'MCP · Custom',
      kindPlugin: (plugin: string) => `MCP · Plugin ${plugin}`,
      inCatalog: 'In the Hermes catalog',
      hostedTwin: 'Managed version available',
      alsoLocal: 'Also runs on this device',
      open: (name: string) => `Open ${name}`,
      turnServerOn: (name: string) => `Turn ${name} on`,
      turnServerOff: (name: string) => `Turn ${name} off`,
      state: {
        accessExpired: 'Access expired',
        available: 'Available',
        connected: 'Connected',
        connecting: 'Connecting',
        connectionUnknown: 'State unknown',
        couldNotConnect: 'Could not connect',
        offByYourOrganisation: 'Off by your organisation',
        offForYou: 'Off for you',
        serverConnecting: 'Connecting…',
        serverError: 'Error',
        serverNeedsAuth: 'Needs authentication',
        serverOff: 'Off',
        serverOn: 'On',
        serverOnUnused: 'On, unused'
      },
      fact: {
        tools: (count: number) => `${count} tool${count === 1 ? '' : 's'}`,
        toolsOff: (count: number) => `${count} tool${count === 1 ? '' : 's'} off`,
        toolsOn: (count: number) => `${count} tool${count === 1 ? '' : 's'} on`,
        toolsSomeOn: (total: number, on: number) => `${total} tools, ${on} on`
      },
      verb: {
        authenticate: 'Authenticate',
        connect: 'Connect',
        install: 'Install',
        openLogs: 'Open logs',
        reconnect: 'Reconnect',
        stopWaiting: 'Stop waiting',
        tryAgain: 'Try again',
        turnBackOn: 'Turn back on'
      },
      reason: {
        finishSignIn: 'Finish the sign-in in your browser.',
        reconnect: 'Reconnect to keep this app working.',
        serverError: 'The server refused the connection.',
        serverNeedsAuth: 'Sign in to let this server answer.'
      }
    },

    page: {
      loading: 'Reading the catalog and the servers on this computer',
      emptyTitle: 'No apps here yet. Add a server on this computer to get started.',
      noMatchTitle: 'No matching apps',
      noMatchBody: 'Nothing here matches. Point Hermes at your own MCP server to add it.',
      clearSearch: 'Clear the search',
      hostedFailedTitle: 'Could not reach the hosted apps.',
      hostedFailedBody: 'The servers on this computer are unaffected and still running. Nothing was turned off.',
      retry: 'Retry',
      matchesElsewhere: (count: number) => `${count} more match${count === 1 ? '' : 'es'} in other groups.`,
      showAllMatches: 'Show all matches',
      segmentNoMatch: (segment: string) => `No match in ${segment}, so every match is shown.`,
      freeTierNote: 'Connections stay on this computer until you sign in.',
      signInLine: 'Sign in to Nous to use managed apps.',
      signIn: 'Sign in',
      managedUnavailable: 'Managed apps are not available for this account yet.',
      writeFailed: 'That change was not saved.',
      refreshFailed: 'The tool list was not refreshed.',
      disconnectNoAccount: 'Hermes has no account to disconnect here. Refresh the page and try again.',
      disconnectRefused:
        'Nous could not remove this sign-in right now. Turn the app off with the switch instead, or try again later.'
    },

    add: {
      action: 'Add your own',
      title: 'Connect to a custom MCP',
      hint: 'one new entry in mcp.json on this device',
      pasteLabel: 'Paste a command or a snippet',
      pastePlaceholder: 'npx -y @modelcontextprotocol/server-filesystem /path/to/dir',
      pasteNoMatch: 'Nothing here reads as a server. Fill the fields below instead.',
      name: 'Name',
      nameTaken: 'That name is already used.',
      type: 'Type',
      typeStdio: 'STDIO',
      typeHttp: 'Streamable HTTP',
      command: 'Command to launch',
      args: 'Arguments',
      addArg: '+ Add argument',
      envVars: 'Environment variables',
      addEnvVar: '+ Add environment variable',
      passthrough: 'Environment variable passthrough',
      addPassthrough: '+ Add variable',
      cwd: 'Working directory',
      url: 'URL',
      headers: 'Headers',
      addHeader: '+ Add header',
      auth: 'Auth',
      authNone: 'None',
      authOauth: 'OAuth',
      authBearer: 'Bearer token',
      keyPlaceholder: 'KEY',
      valuePlaceholder: 'value',
      removeRow: 'Remove this row',
      editJson: 'Edit mcp.json',
      saveFailed: 'That server was not saved.'
    },

    dialog: {
      disconnect: 'Disconnect',
      disconnectTitle: (name: string) => `Disconnect ${name}?`,
      disconnectBody: 'Hermes stops acting as this account. You can connect again at any time.',
      menuRefreshTools: 'Refresh tools',
      moreActions: 'More actions',
      removeServerTitle: (name: string) => `Remove ${name}?`,
      removeServerBody: 'The entry leaves mcp.json on this computer. Nothing else is deleted.',
      appSwitch: (name: string) => `Hermes can use ${name}`,
      waysTitle: (name: string) => `Where ${name} runs`,
      wayNotConnected: (name: string) => `Not connected yet. Sign in to ${name} in your browser.`,
      wayHosted: 'Managed',
      bothOn: (name: string) => `Both are on, so Hermes sees every ${name} tool twice.`,
      turnOffLocal: 'Turn off the local server',
      providedByPlugin: (plugin: string) => `Provided by plugin ${plugin}`,
      openPlugins: 'Open the Plugins tab',
      // Verbatim, by decision of the design of record.
      nousLine: 'Nous apps follow your account, not the profile.',
      rulesReadOnly: 'Rules cannot be changed right now.',
      rulesAppOff: (name: string) => `Turn ${name} on to change its tools.`,
      rulesSignIn: 'Sign in to change what Hermes may do here.',
      orgNote: (count: number) => `Your organisation turned ${count} tools off.`,
      orgLink: 'Open the connectors admin',
      connectEnded: 'The sign-in did not finish.',
      connectOpenAgain: 'Open the link again',
      tokensPerCall: 'tokens per call',
      usesPerMonth: 'uses in 30 days',
      advanced: 'Advanced',
      advancedHint: 'the mcp.json entry and logs'
    },

    tools: {
      title: 'Tools',
      notInstalledBody: 'Install it on this device to see the tools it brings.',
      summaryTitle: (name: string) => `What Hermes may do with ${name}`,
      summaryPreviewTitle: (name: string) => `What Hermes could do with ${name} once you connect`,
      summaryCount: (count: number) => `${count} tool${count === 1 ? '' : 's'}`,
      summaryAllTools: 'All tools',
      summaryOther: 'Other',
      allToolsSwitch: 'Turn every tool on or off',
      summaryAllOn: 'all on',
      summarySomeOn: (on: number, total: number) => `${on} of ${total} on`,
      summaryOff: 'off',
      showAllTools: (count: number) => `Show all ${count} tool${count === 1 ? '' : 's'}`,
      showSummary: 'Show summary',
      facetSwitch: (facet: string) => `Turn ${facet} tools on or off`,
      moreHints: (count: number) => `+${count}`,
      staleSignIn: 'Sign in to read the latest tool list.',
      searchCountPlaceholder: (count: number) => `Search ${count} tools`,
      toolList: (name: string) => `${name} tools`,
      categorySelect: (count: number) => `${count} categories`,
      showDeprecated: (count: number) => `Show ${count} deprecated`,
      hideDeprecated: (count: number) => `Hide ${count} deprecated`,
      quickReadOnly: 'Read only',
      quickNoDestructive: 'Turn off destructive',
      quickEverythingOn: 'Everything on',
      lockedHint: 'off by your organisation',
      turnToolOn: (tool: string) => `Turn ${tool} on`,
      turnToolOff: (tool: string) => `Turn ${tool} off`,
      showDetails: (tool: string) => `Show what ${tool} does`,
      hideDetails: (tool: string) => `Hide what ${tool} does`,
      noMatch: 'No tool matches these filters.',
      loading: 'Reading the tool list',
      unavailableLine: 'Tool list unavailable.',
      needsAuthTitle: (name: string) => `Sign in to ${name} to read its tools.`,
      needsAuthBody: 'The sign-in stays on this computer. Nothing leaves it.',
      retry: 'Retry',
      goneTitle: (name: string) => `${name} left the catalog.`,
      goneBody: 'Hermes cannot call it any more. The row stays until you remove it, so nothing vanishes.',
      remove: 'Remove',
      offTitle: (name: string) => `${name} is off.`,
      offBody: 'Turn it on with the switch above to read the tools it brings.',
      signedOutTitle: 'Sign in to Nous to read the tool list.',
      signedOutBody: 'Your servers on this computer are unaffected.',
      conflictTitle: 'Someone changed this rule while you were editing.',
      // Two sentences at most, and the second says the work is still here.
      conflictBody: (theyOff: number, theyOn: number) => {
        const they = [
          theyOff > 0 ? `turned off ${theyOff} tool${theyOff === 1 ? '' : 's'} you have on` : '',
          theyOn > 0 ? `left ${theyOn} tool${theyOn === 1 ? '' : 's'} on that you turned off` : ''
        ].filter(Boolean)

        return `${they.length > 0 ? `They ${they.join(', and ')}. ` : ''}Your edits stay on screen; nothing was written.`
      },
      conflictReload: 'Reload their version',
      conflictSave: 'Save over their version',
      saveFailed: 'Those tool rules were not saved.',
      footerDirty: (off: number, backOn: number) =>
        `${off} tool${off === 1 ? '' : 's'} off, ${backOn === 0 ? 'none' : backOn} back on`,
      discard: 'Discard',
      save: 'Save changes',
      saving: 'Saving...'
    },

    // The label rides in every tool row, so it stays short enough not to widen one.
    vocabulary: {
      facetRead: { label: 'Read', long: 'Reads data out of this app. It changes nothing.' },
      facetWrite: { label: 'Write', long: 'Creates or changes something in this app.' },
      facetDestructive: { label: 'Destructive', long: 'Can remove something in this app for good.' },
      facetUnclassified: { label: 'Unknown effect', long: 'The app never said what this tool does.' },
      hintReadOnly: { label: 'Read only', long: 'The tool declares that it only reads.' },
      hintCreate: { label: 'Creates', long: 'Makes something new.' },
      hintUpdate: { label: 'Updates', long: 'Changes something that already exists.' },
      hintDelete: { label: 'Deletes', long: 'Removes something.' },
      hintDestructive: { label: 'Destructive', long: 'The change it makes cannot be undone here.' },
      hintIdempotent: { label: 'Repeatable', long: 'Running it twice does what running it once does.' },
      hintOpenWorld: { label: 'External', long: 'Reaches something outside this app.' }
    }
  },

  sessionImport: {
    title: 'Continue from another app',
    subtitle: 'Bring a conversation into Hermes and pick up where you left off.',
    action: 'Import session',
    readingFrom: 'Reading from',
    connectedComputer: 'the connected computer',
    destination: 'Import into',
    all: 'All',
    search: 'Search loaded sessions',
    scanning: 'Finding conversations',
    scanError: 'Could not find sessions',
    scanHelp: 'Check your backend connection, then try again. Older backends may need an update.',
    empty: 'No conversations found',
    emptyHelp: 'Claude Code and Codex sessions on this backend will appear here.',
    noMatches: 'No matching conversations',
    searchHelp: 'Try another title or folder, or load more sessions.',
    skipped: 'Some logs were empty, unreadable, or too large to preview.',
    more: 'Load more sessions',
    messages: 'messages',
    choose: 'A conversation worth continuing',
    chooseHelp: 'Choose a session to read its history before bringing it into Hermes.',
    previewLoading: 'Opening preview',
    previewError: 'Preview unavailable',
    previewHelp: 'The source may have moved or changed. Refresh the list and try again.',
    previewLimit: 'Preview shortened for readability. The complete conversation is imported.',
    you: 'You',
    snapshot: 'This conversation is already in Hermes. Open your existing copy to continue.',
    copyNotice:
      'Copies conversation text. Source files stay unchanged. Tool output and reasoning are not carried over.',
    importing: 'Importing…',
    open: 'Open in Hermes',
    continue: 'Continue in Hermes',
    importError: 'Could not import this conversation.'
  },
  common: {
    apply: 'Apply',
    back: 'Back',
    save: 'Save',
    saving: 'Saving…',
    cancel: 'Cancel',
    change: 'Change',
    choose: 'Choose',
    clear: 'Clear',
    close: 'Close',
    collapse: 'Collapse',
    confirm: 'Confirm',
    connect: 'Connect',
    connecting: 'Connecting',
    continue: 'Continue',
    bots: 'Bots',
    copied: 'Copied',
    copy: 'Copy',
    copyFailed: 'Copy failed',
    delete: 'Delete',
    docs: 'Docs',
    done: 'Done',
    error: 'Error',
    expand: 'Expand',
    failed: 'Failed',
    formatJson: 'Format JSON',
    free: 'Free',
    loading: 'Loading…',
    notSet: 'Not set',
    refresh: 'Refresh',
    remove: 'Remove',
    replace: 'Replace',
    retry: 'Retry',
    run: 'Run',
    send: 'Send',
    set: 'Set',
    skip: 'Skip',
    update: 'Update',
    tryHint: term => `Try “${term}”`,
    on: 'On',
    off: 'Off'
  },

  fileMenu: {
    revealFinder: 'Reveal in Finder',
    revealExplorer: 'Reveal in File Explorer',
    revealFileManager: 'Open containing folder',
    revealInSidebar: 'Reveal in filetree',
    copyPath: 'Copy path',
    copyRelativePath: 'Copy relative path',
    download: 'Download',
    downloadSaved: 'Saved',
    downloadFailed: 'Download failed',
    rename: 'Rename…',
    delete: 'Delete',
    renameTitle: 'Rename',
    renameLabel: 'New name',
    deleteTitle: name => `Delete ${name}?`,
    deleteBody: 'It will be moved to the Trash — you can restore it from there.',
    pathCopied: 'Path copied',
    revealMissing: 'That folder is not on this computer',
    revealUnavailable: 'That path is not on this computer — it lives on the backend machine. Use “Reveal in filetree”.'
  },

  boot: {
    ready: 'Hermes Desktop is ready',
    desktopBootFailedWithMessage: message => `Desktop boot failed: ${message}`,
    steps: {
      connectingGateway: 'Connecting live desktop gateway',
      loadingSettings: 'Loading Hermes settings',
      loadingSessions: 'Loading recent sessions',
      retryingRemoteBackend: 'Reconnecting to the remote Hermes backend…',
      startingDesktopConnection: 'Starting desktop connection',
      startingHermesDesktop: 'Starting Hermes Desktop…'
    },
    errors: {
      backgroundExited:
        'The service that runs your chats closed unexpectedly. Restart it to keep going — your chats and settings are safe.',
      backgroundExitedDuringStartup: 'Hermes stopped right after it started.',
      backendStopped: 'Hermes stopped working in the background',
      restartHermes: 'Restart Hermes',
      openLogs: 'Open logs',
      desktopBootFailed: "Hermes couldn't start",
      gatewayConnectionLost: 'Hermes lost its connection',
      gatewayConnectionLostDetail:
        'Still trying to reconnect. You can keep reading and drafting. If this keeps up, reconnect now or check your connection settings.',
      reconnectNow: 'Reconnect now',
      connectionSettings: 'Connection settings',
      gatewaySignInRequired: 'Your remote Hermes signed you out',
      gatewaySignInRequiredDetail: 'Sign in again to reconnect. Your chats and settings are safe.',
      signInAgain: 'Sign in again',
      ipcBridgeUnavailable: "Hermes Desktop couldn't talk to its own background layer. Restart the app."
    },
    // Plain causes for a local backend boot failure (`classifyBootFailure`);
    // the raw output stays behind "Show recent logs".
    causes: {
      exitedEarly: "Hermes' background service stopped right after starting.",
      timedOut: "Hermes' background service didn't answer in time.",
      permission: "Hermes couldn't write to its data folder (permission problem).",
      diskFull: 'The disk is full, so Hermes could not start.',
      portInUse: 'Another program is using the network port Hermes needs.',
      installMissing: "Part of Hermes' installation is missing. Choose Repair install to put it back."
    },
    failure: {
      title: "Hermes couldn't start",
      description:
        "Hermes' background service didn't come up. Try one of the recovery steps below. Nothing here deletes your chats or settings.",
      details: 'Details',
      remoteTitle: 'Remote gateway sign-in required',
      remoteDescription:
        'Your remote gateway session has expired. Sign in again to reconnect. Nothing here deletes your chats or settings.',
      retry: 'Retry',
      repairInstall: 'Repair install',
      useLocalGateway: 'Use local gateway',
      gatewaySettings: 'Gateway settings',
      back: 'Back',
      openLogs: 'Open logs',
      repairHint: 'Repair re-runs the installer and can take a few minutes on a fresh machine.',
      bundledReinstallHint:
        'This bundled install can’t repair itself from inside the app — reinstall the app to restore its backend.',
      reinstallApp: 'Reinstall the app',
      remoteSignInHint: signInLabel =>
        `Signs out of the saved remote browser session, then opens ${signInLabel}. Use local gateway to switch to the bundled backend instead.`,
      signOutAndSignIn: 'Sign out & sign in',
      remoteFailureHint: 'Check the gateway URL and sign-in under Gateway settings, or switch to the local gateway.',
      cloudDownTitle: 'Nous Cloud agent is down',
      cloudDownDescription:
        'The Nous-managed cloud agent this gateway connects to is returning a server error. It cannot be restarted from here — check its status, switch to the local gateway, or get support.',
      cloudDownHint:
        'The buttons below open the Nous Portal (instance status and controls) and our Discord for support.',
      cloudDownCheckPortal: 'Check Portal status',
      cloudDownDiscord: 'Get help on Discord',
      hideRecentLogs: 'Hide recent logs',
      showRecentLogs: 'Show recent logs',
      signedInTitle: 'Signed in',
      signedInMessage: 'Reconnecting to the remote gateway…',
      signInIncompleteTitle: 'Sign-in incomplete',
      signInIncompleteMessage: 'The login window closed before authentication finished.',
      signInFailed: 'Sign-in failed',
      signInToRemoteGateway: 'Sign in to remote gateway',
      signInWithProvider: provider => `Sign in with ${provider}`,
      identityProvider: 'your identity provider'
    }
  },

  notifications: {
    sharedProfileWarning:
      'Another Hermes installation is using this profile. Both installations share its settings and data, so changes can conflict. You can continue, or close the other installation before making changes.',
    region: 'Notifications',
    hide: 'Hide',
    show: 'Show',
    more: count => `${count} more ${count === 1 ? 'notification' : 'notifications'}`,
    clearAll: 'Clear all',
    dismiss: 'Dismiss notification',
    details: 'Details',
    copyDetail: 'Copy detail',
    copyDetailFailed: 'Could not copy notification detail',
    compressDeferredDone: 'Context compression finished',
    backendOutOfDateTitle: 'Backend out of date',
    backendOutOfDateMessage:
      'Your Hermes backend is older than this desktop build and may not work correctly. Update to align them.',
    desktopOutOfDateTitle: 'Hermes app out of date',
    desktopOutOfDateMessage:
      'This Hermes app is older than the backend it is connected to and may not work correctly. Update the app to align them.',
    updateDesktopApp: 'Update app',
    installMethodUnsupportedTitle: 'Unsupported install method',
    updateHermes: 'Update Hermes',
    updateReadyTitle: 'Update ready',
    updateReadyMessage: count => `${count} new change${count === 1 ? '' : 's'} available.`,
    updateReadyMessageUnknown: 'A new update is available.',
    updateReadyMessageAppInstaller: 'A new version of Hermes is ready. Update now and Windows will finish it for you.',
    seeWhatsNew: "See what's new",
    mcp: {
      needsAuthTitle: 'MCP server needs re-authentication',
      needsAuthMessage: name => `${name} MCP needs re-authentication.`,
      errorTitle: 'MCP server unreachable',
      errorMessage: name => `${name} MCP failed its health check.`,
      signIn: 'Sign in',
      view: 'View',
      disable: 'Disable',
      disabledMessage: name => `${name} MCP disabled. Re-enable it any time from Capabilities → MCP.`,
      disableFailed: name => `Could not disable ${name} MCP.`
    },
    errors: {
      elevenLabsNeedsKey: 'Voice input needs an ElevenLabs key. Add one in Settings → Keys.',
      elevenLabsRejectedKey: "ElevenLabs didn't accept your API key. Update it in Settings → Keys, then try again.",
      diskFull: 'Disk full — free some space, then try again.',
      storageFailure: "Hermes couldn't save to its data folder. Open Maintenance to check and repair it.",
      gatewayAuthFailed:
        'This Hermes no longer accepts your saved sign-in. Open Gateways and sign in again (or paste a new access token), then retry.',
      methodNotAllowed:
        "Hermes' background service is out of step with the app, probably after an update. Restart it to fix this.",
      microphonePermission: 'Microphone permission was denied.',
      openaiRejectedApiKey: "OpenAI didn't accept your API key. Update it in Settings → Keys, then try again.",
      openaiTtsNeedsKey: 'Voice needs an OpenAI key. Add one in Settings → Keys.',
      codeSkewRestartRequired:
        'Hermes was updated but is still running the old version. Restart it to finish the update.',
      rpcOutOfSync: 'The app and the backend are on different versions. Update both.',
      restartHermesFailed: "Couldn't restart Hermes"
    },
    actions: {
      restartHermes: 'Restart Hermes',
      openKeys: 'Open Keys',
      openGateways: 'Open Gateways',
      openMaintenance: 'Open Maintenance'
    },
    voice: {
      configureSpeechToText: 'Configure speech-to-text to use voice mode.',
      couldNotStartSession: 'Could not start voice session',
      microphoneAccessDenied: 'Microphone access denied.',
      microphoneConstraintsUnsupported: 'Microphone constraints are not supported by this device.',
      microphoneFailed: 'Microphone failed',
      microphoneInUse: 'Microphone is already in use by another app.',
      microphonePermissionDenied: 'Microphone permission was denied.',
      microphoneStartFailed: 'Could not start microphone recording.',
      microphoneUnsupported: 'This runtime does not support microphone recording.',
      noMicrophone: 'No microphone was found.',
      noSpeechDetected: 'No speech detected',
      playbackFailed: 'Voice playback failed',
      recordingFailed: 'Voice recording failed',
      sayStopToEnd: phrase => `Say "${phrase}" to end the voice chat.`,
      transcriptionFailed: 'Voice transcription failed',
      transcriptionUnavailable: 'Voice transcription is not available yet.',
      tryRecordingAgain: 'Try recording again.',
      unavailable: 'Voice unavailable',
      liveEnded: 'Live voice session ended',
      liveEndedConnectionLost: 'The live voice session lost its connection.',
      liveEndedClosed: 'The live voice session was closed by the service.',
      liveError: 'Live voice',
      liveDelegationFailed: 'Could not hand the request to Hermes',
      liveUnavailable: reason => `GPT-Live voice chat is not available: ${reason}. Using speech-to-text instead.`
    },
    native: {
      approvalTitle: 'Approval needed',
      approvalTitleNamed: session => `Approval needed — ${session}`,
      approveAction: 'Approve',
      rejectAction: 'Reject',
      inputTitle: 'Input needed',
      inputTitleNamed: session => `Input needed — ${session}`,
      inputBody: 'Hermes is waiting for your response.',
      turnDoneTitle: 'Hermes finished',
      turnDoneBody: '',
      turnErrorTitle: 'Turn failed',
      backgroundDoneTitle: 'Background task finished',
      backgroundFailedTitle: 'Background task failed',
      creditsTitle: 'Credits'
    }
  },

  remoteDisplayBanner: {
    message: reason =>
      `Software rendering active — remote display detected (${reason}). GPU acceleration is disabled to prevent flickering.`
  },

  billingBlock: {
    titleNous: 'Out of Nous credits',
    titleProvider: provider => `Out of credits — ${provider}`,
    fallbackMessage: 'Your account is out of credits. Add credits to keep going.',
    openBilling: 'Open billing',
    addCredits: 'Add credits',
    dismiss: 'Dismiss'
  },

  sendDiagnostics: {
    title: 'Send diagnostics to Nous',
    privacyNotice:
      'This uploads a debug bundle to Nous-internal storage (not a public paste). It includes system info (OS, versions, provider, which API keys are configured — never the keys themselves) and full agent, gateway, and desktop logs (up to 512 KB each), which likely contain conversation content, tool outputs, and file paths. Secrets are redacted before upload. The bundle is viewable only by Nous staff and allowlisted Discord moderators, and auto-deletes after 14 days.',
    upload: 'Upload',
    uploading: 'Uploading…',
    cancel: 'Cancel',
    close: 'Close',
    copyLink: 'Copy link',
    uploadIdFallback: id => `No view link returned — quote upload ID ${id} to support`,
    doneTitle: 'Diagnostics sent',
    doneDescription:
      'Your bundle was uploaded privately. Share the link below in your support thread so the team can see your logs.',
    failedTitle: 'Upload failed',
    failedHint:
      'You can also run `hermes debug share --nous` from a terminal, or `hermes debug share --local` to print the report without uploading.',
    handoffLead: 'Pick up the discussion in:',
    links: {
      github: 'GitHub Issues',
      portal: 'Nous Portal Support',
      discord: 'Discord'
    }
  },

  titlebar: {
    hideSidebar: 'Hide sidebar',
    showSidebar: 'Show sidebar',
    search: 'Search',
    searchTitle: 'Search sessions, views, and actions',
    swapSidebarSides: 'Swap sidebar sides',
    hideRightSidebar: 'Hide right sidebar',
    showRightSidebar: 'Show right sidebar',
    unreadSessions: count => (count === 1 ? '1 unread session' : `${count} unread sessions`),
    muteHaptics: 'Mute haptics',
    unmuteHaptics: 'Unmute haptics',
    openSettings: 'Open settings',
    openStarmap: 'Open memory graph',
    enterHud: 'HUD mode',
    exitHud: 'Exit HUD mode',
    resetHudLayout: 'Reset HUD size and position',
    layoutEditor: 'Layout editor',
    layoutEditorTitle: mod => `Layout editor — ${mod}-click resets the layout`
  },

  keybinds: {
    title: 'Keyboard shortcuts',
    subtitle: open => `Click a shortcut to rebind it · ${open} reopens this panel.`,
    search: 'Search shortcuts…',
    rebind: 'Rebind',
    reset: 'Reset to default',
    resetAll: 'Reset all',
    clear: 'Clear',
    pressKey: 'Press a key…',
    set: 'set',
    conflictWith: label => `Also bound to “${label}”`,
    categories: {
      composer: 'Composer',
      profiles: 'Profiles',
      session: 'Session',
      navigation: 'Navigation',
      view: 'View'
    },
    actions: {
      'keybinds.openPanel': 'Open keyboard shortcuts',
      'nav.commandPalette': 'Open command palette',
      'nav.commandCenter': 'Open command center',
      'nav.settings': 'Open settings',
      'nav.profiles': 'Open profiles',
      'nav.capabilities': 'Open skills',
      'nav.messaging': 'Open messaging',
      'nav.artifacts': 'Open artifacts',
      'nav.cron': 'Open scheduled jobs',
      'nav.agents': 'Open agents',
      'session.new': 'New session',
      'session.newTab': 'New session tab',
      'session.newWindow': 'New window',
      'session.next': 'Next session',
      'session.prev': 'Previous session',
      'session.slot.1': 'Switch to recent session 1',
      'session.slot.2': 'Switch to recent session 2',
      'session.slot.3': 'Switch to recent session 3',
      'session.slot.4': 'Switch to recent session 4',
      'session.slot.5': 'Switch to recent session 5',
      'session.slot.6': 'Switch to recent session 6',
      'session.slot.7': 'Switch to recent session 7',
      'session.slot.8': 'Switch to recent session 8',
      'session.slot.9': 'Switch to recent session 9',
      'session.focusSearch': 'Search sessions',
      'session.togglePin': 'Pin / unpin current session',
      'session.archive': 'Archive current session',
      'conversation.scrollPageUp': 'Scroll conversation up one page',
      'conversation.scrollPageDown': 'Scroll conversation down one page',
      'workspace.newWorktree': 'New worktree',
      'workspace.openFolder': 'Open folder as project',
      'composer.focus': 'Focus composer',
      'composer.modelPicker': 'Open model picker',
      'composer.voice': 'Start / stop voice conversation',
      'composer.dictate': 'Start / stop dictation',
      'composer.reasoningUp': 'Reasoning level up',
      'composer.reasoningDown': 'Reasoning level down',
      'view.toggleSidebar': 'Toggle sessions sidebar',
      'view.cycleSidebarGrouping': 'Cycle session grouping',
      'view.toggleRightSidebar': 'Toggle file browser',
      'view.toggleReview': 'Toggle review pane',
      'view.toggleStatusbar': 'Toggle status bar',
      'view.toggleTabStrip': 'Toggle tabs',
      'view.toggleProfileRail': 'Toggle profile rail',
      'view.toggleSimpleMode': 'Toggle Simple mode',
      'view.showFiles': 'Show file browser',
      'view.showBrowser': 'Toggle browser',
      'view.toggleHud': 'Toggle HUD mode',
      'hud.snapToPointer': 'Move HUD to pointer (global, while HUD is open)',
      'view.showTerminal': 'Toggle terminal',
      'view.newTerminal': 'New terminal',
      'view.nextTerminal': 'Next terminal',
      'view.prevTerminal': 'Previous terminal',
      'view.closeTerminal': 'Close terminal',
      'view.selectionToComposer': 'Send selection to composer',
      'view.terminalCopy': 'Copy terminal selection',
      'view.terminalPaste': 'Paste into terminal',
      'view.closeTab': 'Close tab',
      'view.reopenTab': 'Reopen closed tab',
      'view.flipPanes': 'Swap sidebar sides',
      'view.findInPage': 'Find in page',
      'view.findNext': 'Find next match',
      'view.findPrevious': 'Find previous match',
      'view.tabSlot.1': 'Switch to tab 1',
      'view.tabSlot.2': 'Switch to tab 2',
      'view.tabSlot.3': 'Switch to tab 3',
      'view.tabSlot.4': 'Switch to tab 4',
      'view.tabSlot.5': 'Switch to tab 5',
      'view.tabSlot.6': 'Switch to tab 6',
      'view.tabSlot.7': 'Switch to tab 7',
      'view.tabSlot.8': 'Switch to tab 8',
      'view.tabSlot.9': 'Switch to tab 9',
      'appearance.toggleMode': 'Toggle light / dark',
      'profile.default': 'Switch to default profile',
      'profile.switch.1': 'Switch to profile 1',
      'profile.switch.2': 'Switch to profile 2',
      'profile.switch.3': 'Switch to profile 3',
      'profile.switch.4': 'Switch to profile 4',
      'profile.switch.5': 'Switch to profile 5',
      'profile.switch.6': 'Switch to profile 6',
      'profile.switch.7': 'Switch to profile 7',
      'profile.switch.8': 'Switch to profile 8',
      'profile.switch.9': 'Switch to profile 9',
      'profile.switch.10': 'Switch to profile 10',
      'profile.switch.11': 'Switch to profile 11',
      'profile.switch.12': 'Switch to profile 12',
      'profile.switch.13': 'Switch to profile 13',
      'profile.switch.14': 'Switch to profile 14',
      'profile.switch.15': 'Switch to profile 15',
      'profile.switch.16': 'Switch to profile 16',
      'profile.switch.17': 'Switch to profile 17',
      'profile.switch.18': 'Switch to profile 18',
      'profile.next': 'Next profile',
      'profile.prev': 'Previous profile',
      'profile.toggleAll': 'Toggle all-profiles view',
      'profile.create': 'Create profile',
      'composer.send': 'Send message',
      'composer.newline': 'Insert newline',
      'composer.steer': 'Steer the running turn',
      'composer.queue': 'Queue message',
      'composer.sendQueued': 'Send next queued turn',
      'composer.mention': 'Reference files, folders, URLs',
      'composer.slash': 'Slash command palette',
      'composer.help': 'Quick help',
      'composer.history': 'Cycle popover / history',
      'composer.cancel': 'Close popover · cancel run'
    }
  },

  findInPage: {
    next: 'Next match',
    previous: 'Previous match'
  },

  language: {
    label: 'Language',
    description: 'Choose the language for the desktop interface.',
    saving: 'Saving language…',
    saveError: 'Language update failed',
    switchTo: 'Switch language',
    searchPlaceholder: 'Search languages…',
    noResults: 'No languages found'
  },

  settings: {
    subpages: {
      appearanceTheme: 'Theme',
      appearanceTypography: 'Typography',
      appearanceWindowLayout: 'Window & layout',
      appearanceChatDisplay: 'Chat display',
      appearancePet: 'Pet',
      appearanceGeneral: 'General',
      modelMain: 'Main model',
      modelAuxiliary: 'Auxiliary models',
      modelMoa: 'Mixture of Agents',
      modelFallbacks: 'Fallback models',
      chatBehavior: 'Behavior',
      chatAttachments: 'Attachments',
      workspaceProjects: 'Projects & discovery',
      workspaceShell: 'Shell environment',
      workspaceFiles: 'Files & execution',
      safetyApprovals: 'Approvals',
      safetyPrivacy: 'Privacy & network',
      safetyCheckpoints: 'Checkpoints',
      browserProfile: 'Browser profile',
      browserNetwork: 'Local & private URLs',
      memoryPersistent: 'Persistent memory',
      memoryContext: 'Context & compression',
      voiceConversation: 'Voice conversation',
      voiceTranscription: 'Speech to text',
      voiceSpeech: 'Text to speech',
      advancedRuntime: 'Agent limits',
      advancedTools: 'Tool access',
      advancedTerminal: 'Terminal backend',
      advancedOutput: 'Output limits',
      advancedDelegation: 'Subagents',
      advancedDesktop: 'Desktop & startup',
      gatewayConnection: 'This window',
      gatewayDevices: 'Saved connections',
      gatewayManagedUpdates: 'Remote updates',
      gatewayManagedUpdatesUnavailable: 'Remote updates need a desktop version with managed SSH update support.',
      gatewayManagedUpdatesEmpty: 'Add an SSH connection in Saved connections to manage its updates here.',
      keyboardShortcuts: 'Key bindings',
      hudGesture: 'HUD gesture',
      screenCapture: 'Screen capture',
      notificationAlerts: 'Desktop alerts',
      notificationSounds: 'Sounds',
      archivedSessions: 'Archive & retention',
      defaultDirectory: 'Default project folder',
      vaultCredentials: 'Saved credentials',
      vaultSources: 'Password managers',
      appUpdates: 'Version & updates',
      uninstall: 'Uninstall',
      billingOverview: 'Overview',
      billingPlans: 'Plans'
    },
    closeSettings: 'Close settings',
    exportConfig: 'Export config',
    importConfig: 'Import config',
    resetToDefaults: 'Reset to defaults',
    resetConfirm: 'Reset all settings to Hermes defaults?',
    exportFailed: 'Export failed',
    resetFailed: 'Reset failed',
    nav: {
      providers: 'Providers',
      providerAccounts: 'Accounts',
      providerApiKeys: 'API keys',
      providerCustomEndpoints: 'Custom Endpoints',
      providerLocalModels: 'Local Models',
      gateway: 'Gateways',
      apiKeys: 'Tools & Keys',
      keybinds: 'Keyboard Shortcuts',
      keysTools: 'Tools',
      keysSettings: 'Settings',
      mcp: 'MCP',
      archivedChats: 'Archived Chats',
      sessions: 'Sessions',
      about: 'About',
      billing: 'Billing',
      notifications: 'Notifications',
      vault: 'Passwords & Logins'
    },
    plugins: {
      title: 'Desktop plugins',
      blurb:
        'Extend this app, not an agent — installed once for the whole app, whichever profile, gateway, or machine you connect to. Bundled or dropped into the desktop-plugins folder; toggles apply live.',
      count: n => `${n} installed`,
      openFolder: 'Open Desktop plugins folder',
      rescan: 'Rescan',
      reveal: 'Reveal in file manager',
      enable: 'Enable',
      disable: 'Disable',
      failed: 'failed',
      empty: 'No desktop plugins installed yet.',
      kinds: { bundled: 'bundled', disk: 'on disk', runtime: 'runtime' },
      agentHalfMissing: 'agent half missing here',
      agentHalfMissingTip:
        'This is the desktop half of a bundled plugin, but its agent half is not installed on the currently connected backend/profile. Install it from Capabilities → Plugins.',
      installModal: {
        installFromGit: 'Install from Git',
        reviewRepository: 'Review repository',
        repoPlaceholder: 'https://github.com/owner/repo',
        title: 'Install plugin',
        description: 'Review what this repository contains before installing anything.',
        repoLabel: 'Repository',
        includesHeading: 'This package includes',
        agentLabel: 'Agent plugin',
        desktopLabel: 'Desktop UI',
        profileLabel: 'Install for profile',
        agentTargetLocal: (profile, dir) => `Installs into the ${profile} backend (${dir})`,
        agentTargetRemote: profile => `Installs into the connected ${profile} backend`,
        catalogPinned: (name, sha) =>
          `Hermes catalog entry "${name}" — the agent component installs at the reviewed pin${sha ? ` ${sha}` : ''}, not the branch tip.`,
        reviewedHeading: 'Reviewed catalog entry',
        reviewedIntro:
          'This entry was human-reviewed at its pinned commit. You can still inspect the exact code below.',
        toolsConnected: n => (n === 1 ? '1 tool connected' : `${n} tools connected`),
        skillsReady: names => (names.length === 1 ? `skill ${names[0]} ready` : `${names.length} skills ready`),
        nextChat: 'more tools available in your next chat',
        serverNotConnected: (server, reason) => `MCP server ${server} is not connected${reason ? `: ${reason}` : '.'}`,
        missingEnvAction: 'Set it up',
        alreadyInstalled: (name: string) => `${name} is already installed.`,
        desktopTarget: "Installs into this app's local desktop-plugins folder",
        desktopTargetFromPackage: 'Loaded into this app from the package above — same for every profile',
        desktopOnlyNote: 'Desktop-only packages do not install a backend agent plugin.',
        insecureWarning: 'This URL uses an insecure or local scheme. Prefer https:// or git@ for production installs.',
        securityHeading: 'Before you install',
        securityIntro:
          'Install only from sources you trust — review the repository below if you want to see what will be added.',
        sourceHeading: 'Source code',
        viewRepository: 'View repository',
        viewPluginFiles: 'View plugin files',
        gitCloneLabel: 'Git clone URL',
        enableAgent: 'Enable agent plugin after install',
        forceReinstall: 'Force reinstall (replace if already installed)',
        pinToCommit: 'Pin to commit (optional)',
        pinToCommitPlaceholder: 'Full 40-character commit SHA',
        pinToCommitHint:
          'Everyone installing this SHA gets the same code; the plugin then refuses updates until re-pinned. Leave empty for the latest commit.',
        pinToCommitInvalid: 'Must be a full 40-character commit SHA (branches and tags are not accepted).',
        install: 'Install',
        installing: 'Installing…',
        probing: 'Inspecting repository…',
        probeUnavailable: 'Plugin inspection is unavailable in this environment.',
        desktopUnavailable: 'Desktop plugin install is unavailable in this environment.',
        selectComponent: 'Select at least one component to install.',
        agentSuccess: name => `Agent plugin ${name} installed`,
        desktopSuccess: name => `Desktop plugin ${name} installed`,
        agentFailed: 'Agent plugin install failed',
        installUncertain:
          'Hermes stopped waiting for the install result, but the plugin may still be installing. Close this dialog and use Rescan in Plugins before trying Install again.',
        desktopFailed: 'Desktop plugin install failed',
        missingEnv: (name, vars) =>
          `${name} is installed but needs a key before it can work: ${vars}. Add it now, or the plugin's tools will fail.`
      }
    },
    vault: {
      title: 'Passwords & Logins',
      blurb:
        'Say "log into GitHub" and the agent signs in for you. The first time it meets a sign-in page it asks you for the login right there; after that it just works. Passwords are encrypted on this machine and filled straight into the page — the model never sees them.',
      count: n => `${n} saved`,
      loadFailed: 'Could not load vault items',
      empty: 'Nothing saved yet',
      emptyDesc:
        "You don't have to add anything here. Ask the agent to sign into a site and it will ask you for the login once, on the spot. Use Add if you prefer to enter one ahead of time.",
      add: 'Add',
      addTitle: 'Add a login, card or address',
      addDescription: 'Stored encrypted on this machine. The agent never sees the password.',
      added: 'Saved.',
      adding: 'Saving…',
      addConfirm: 'Save',
      kindField: 'Kind',
      kinds: { login: 'Login', payment: 'Payment card', address: 'Address' },
      labelField: 'Label',
      labelPlaceholder: 'e.g. GitHub work account',
      labelRequired: 'A label is required.',
      originField: 'Site origin',
      originPlaceholder: 'https://github.com',
      originPlaceholderCheckout: 'https://shop.example.com',
      originInvalid: 'Enter a valid URL like https://example.com.',
      identifierTypeField: 'Identifier type',
      identifierTypes: { email: 'Email', phone: 'Phone', username: 'Username' },
      identifierField: 'Identifier',
      identifierShown: identifier => identifier,
      passwordField: 'Password',
      loginFieldsRequired: 'Identifier and password are required.',
      cardNumberField: 'Card number',
      cardNameField: 'Name on card',
      expMonthField: 'Exp. month',
      expYearField: 'Exp. year',
      cvcField: 'CVC',
      postalField: 'Postal code',
      addressLine1Field: 'Address line 1',
      addressLine2Field: 'Address line 2',
      cityField: 'City',
      stateField: 'State / region',
      countryField: 'Country',
      optional: '(optional)',
      createdOn: date => `Added ${date}`,
      deleteAction: 'Remove saved item',
      otpField: 'Authenticator key',
      otpPlaceholder: 'Base32 secret or otpauth:// link',
      otpHint: 'The "setup key" the site shows when you enable 2FA. With it saved, Hermes generates the codes itself.',
      twoFactorBadge: '2FA auto',
      deleteTitle: 'Delete this item?',
      deleteDescription: label => `"${label}" will be removed. This cannot be undone.`,
      deleteConfirm: 'Delete',
      sources: {
        title: 'Password managers',
        blurb:
          'Installed password managers are picked up automatically. The agent asks you to unlock one the first time it needs a login from it (once per session); only a session token stays in memory, and the agent never sees your master password or any login.',
        toggleFailed: 'Could not update password manager',
        notInstalled: name =>
          `Not detected. Install the ${name} command-line tool and sign in to it; Hermes picks it up automatically.`,
        disabledDesc: 'Detected but turned off for Hermes.',
        lockedDesc: 'Detected. The agent will ask you to unlock it when it needs a login, or unlock now.',
        unlockedDesc: 'Unlocked for this session. Locks automatically after 30 minutes idle or when Hermes closes.',
        statusLocked: 'Locked',
        statusNotDetected: 'Not detected',
        statusOff: 'Off',
        statusUnlocked: 'Unlocked',
        unlock: 'Unlock',
        unlocking: 'Unlocking…',
        lock: 'Lock',
        unlocked: name => `${name} unlocked for this session.`,
        unlockTitle: name => `Unlock ${name}`,
        unlockDescription:
          'Enter your master password. It is handed to the password manager on this machine and discarded — it is never stored, logged, or shown to the agent.',
        masterPasswordPlaceholder: 'Master password'
      }
    },
    notifications: {
      title: 'Notifications',
      intro: 'OS notifications (not in-app toasts). Per device.',
      enableAll: 'Enable notifications',
      enableAllDesc: 'Off silences every notification below.',
      focusedHint: 'Completion alerts only fire while Hermes is in the background.',
      kinds: {
        approval: {
          label: 'Approval needed',
          description: 'A command is waiting for you to approve or reject it.'
        },
        input: {
          label: 'Input needed',
          description: 'Hermes asked a question or needs a password or secret.'
        },
        turnDone: {
          label: 'Response ready',
          description: 'A turn finished while Hermes was in the background.'
        },
        turnError: {
          label: 'Turn failed',
          description: 'Background turn errors.'
        },
        backgroundDone: {
          label: 'Background task finished',
          description: 'A backgrounded terminal command completed.'
        },
        credits: {
          label: 'Credit alerts',
          description: 'Credit access is paused or restored.'
        },
        plugin: {
          label: 'Plugin notifications',
          description: 'A desktop plugin sent a notification while Hermes was in the background.'
        }
      },
      test: 'Send test notification',
      testTitle: 'Hermes',
      testBody: 'Notifications are working.',
      testSent: 'Test sent. If nothing appears, check your OS notification permissions and Focus/Do Not Disturb.',
      testUnsupported: 'This system does not support native notifications.',
      completionSoundTitle: 'Completion Sound',
      completionSoundDesc: 'Plays when an agent turn finishes. Pick a preset and preview it here.',
      completionSoundPreview: 'Preview'
    },
    sections: {
      model: 'Model',
      chat: 'Chat',
      appearance: 'Appearance',
      workspace: 'Workspace',
      safety: 'Safety',
      memory: 'Memory & Context',
      voice: 'Voice',
      advanced: 'Advanced'
    },
    searchPlaceholder: {
      about: 'About Hermes Desktop',
      config: 'Search settings...',
      gateway: 'Gateway connection...',
      keys: 'Search API keys...',
      mcp: 'Search MCP servers...',
      sessions: 'Search archived sessions...'
    },
    modeOptions: {
      light: { label: 'Light', description: 'Bright desktop surfaces' },
      dark: { label: 'Dark', description: 'Low-glare workspace' },
      system: { label: 'System', description: 'Follow OS appearance' }
    },
    appearance: {
      chatTextScaleTitle: 'Chat Text Size',
      chatTextScaleDesc:
        'Scales conversation text and the message editor relative to UI Scale. Sidebars and controls stay the same size.',
      title: 'Appearance',
      intro: 'Desktop-only. Mode is brightness; theme is palette and chat chrome.',
      colorMode: 'Color Mode',
      colorModeDesc: 'Pick a fixed mode or let Hermes follow your system setting.',
      toolViewTitle: 'Tool Call Display',
      toolViewDesc: 'Product hides raw tool payloads; Technical shows full input/output.',
      hideCodeDiffsTitle: 'Hide code diffs',
      hideCodeDiffsDesc: 'Show file edits as inline tool rows with added/removed line counts, without the code.',
      hideThreadTimelineTitle: 'Hide thread timeline bars',
      hideThreadTimelineDesc: 'Hide the navigation bars along the right edge of each conversation.',
      reasoningCollapsedTitle: 'Collapse thinking by default',
      reasoningCollapsedDesc: 'Keep streamed reasoning available without expanding it until you open it.',
      trajectoryCollapsedTitle: 'Collapse execution trajectory into summary',
      trajectoryCollapsedDesc:
        'Fold thoughts and tool steps into one "Completed N steps" line once the final reply starts.',
      uiScaleTitle: 'UI Scale',
      uiScaleDesc: (percent: number) =>
        `Scales text and controls across the whole app. Cmd/Ctrl with +, - and 0 also works. Current: ${percent}%.`,
      sessionDensityTitle: 'Session List Density',
      sessionDensityDesc: 'Choose how much context appears beneath session titles in the sidebar.',
      sessionDensityCompact: 'Compact',
      sessionDensityComfortable: 'Comfortable',
      sessionDensityDetailed: 'Detailed',
      tabStripTitle: 'Tab Strip',
      tabStripDesc:
        'Show tabs above a zone. Auto hides them for a single pane unless another chat or tile zone is open.',
      tabStripAuto: 'Auto',
      tabStripAlways: 'Always',
      tabStripNever: 'Never',
      appActionsTitle: 'App Actions',
      appActionsDesc: 'Where Settings, Layout, and HUD sit in the titlebar. Right leaves room for tabs on the left.',
      appActionsLeft: 'Left',
      appActionsRight: 'Right',
      terminalFontTitle: 'Terminal Font',
      terminalFontDesc:
        'Choose an installed font for Desktop terminals. Nerd Fonts render Powerlevel10k and shell icons; leave blank to use bundled JetBrains Mono.',
      terminalFontPlaceholder: 'MesloLGS NF or a CSS font stack',
      terminalFontPreview: 'Glyph preview',
      terminalFontReset: 'Use default',
      chatFontTitle: 'Chat Font',
      chatFontDesc:
        "Choose an installed font for chat and the rest of the app. Handy for readability faces such as OpenDyslexic; leave blank to use the theme's font.",
      chatFontPlaceholder: 'OpenDyslexic or a CSS font stack',
      chatFontPreview: 'Preview',
      chatFontSample: 'The quick brown fox jumps over the lazy dog. 0123456789',
      chatFontReset: 'Use theme font',
      translucencyTitle: 'Window Translucency',
      translucencyDesc: 'See your desktop through the whole window, text and all. Tuned separately for light and dark.',
      translucencyGlassDesc:
        'Matte glass: the desktop shows through as a smooth blur while text stays sharp. Tuned separately for light and dark.',
      translucencyModeClear: 'Clear',
      translucencyModeGlass: 'Glass',
      translucencyTintTitle: 'Tint',
      translucencyFadeTitle: 'Fade',
      translucencyFrostTitle: 'Frost',
      translucencyFrost: {
        'under-window': 'Deep',
        popover: 'Soft',
        titlebar: 'Bright',
        header: 'Glare'
      },
      translucencyScopeTitle: 'Area',
      translucencyScope: {
        window: 'Whole window',
        sidebar: 'Sidebar only'
      },
      backdropTitle: 'Chat Backdrop',
      backdropDesc: 'The faint statue image behind the conversation.',
      userBubbleTitle: 'Message Bubble',
      userBubbleDesc: 'How see-through your own messages are. Solid at 0; only the outline remains at 100.',
      textDirectionTitle: 'Text direction',
      textDirectionDesc:
        'How chat messages and the composer choose their direction. Auto follows the first letter of each paragraph; pick a direction when mixed text lines up the wrong way. Code always stays left-to-right.',
      textDirection: { auto: 'Auto', rtl: 'Right-to-left', ltr: 'Left-to-right' },
      introSplashTitle: 'Intro Splash',
      introSplashDesc: 'The wordmark and prompt shown on an empty chat.',
      modelPricingTitle: 'Model Pricing',
      modelPricingDesc: 'Show input, output, and cache-read prices per million tokens in the model picker.',
      reactionsTitle: 'Message Reactions',
      reactionsDesc: 'iMessage-style emoji tapbacks — react to messages, and Hermes can react to yours.',
      tipsTitle: 'In-App Tips',
      tipsDesc:
        'Occasional hints from the app and Hermes. Each tip appears once. Turns off automatically after your first 30 days; you can turn it back on.',
      tipsReset: (count: number) => `Show ${count} ${count === 1 ? 'tip' : 'tips'} again`,
      toursTitle: 'Guided Tours',
      toursDesc:
        'Let Hermes spotlight each step as it guides you through the app. Turns off automatically after your first 30 days; you can turn it back on.',
      composerPopoutTitle: 'Floating Composer',
      composerPopoutDesc: 'Allow dragging the composer out of its dock. When off, it stays docked at the bottom.',
      fileBrowserTitle: 'File Browser',
      fileBrowserDesc:
        'Show the file browser beside the chat when a workspace is open. The titlebar toggle changes this too.',
      vibeHeartsTitle: 'Vibe Hearts',
      vibeHeartsDesc:
        'Floating hearts when you say thanks, ily, good bot, or send a heart. Separate from Message Reactions above.',
      embedsTitle: 'Inline Embeds',
      embedsDesc:
    …38231 tokens truncated…TokenTest: 'Enter a session token before testing this gateway.',
    testConnection: 'Test connection',
    testSucceeded: (baseUrl, version) => `Connected to ${baseUrl}${version ? ` (${version})` : ''}.`,
    applyRemote: 'Apply and reconnect',
    backToSetup: 'Back',
    failedTitle: 'Installation failed',
    settingUpTitle: 'Setting up Hermes Agent',
    finishingTitle: 'Finishing up',
    failedDesc:
      'One of the setup steps did not finish. This can happen when another copy of Hermes is running, the internet connection dropped, or antivirus blocked the installer. Close other Hermes windows, then choose Reload and retry. If it fails again, open the logs and send them to support.',
    activeDesc:
      'This is a one-time setup. The Hermes installer is downloading dependencies and configuring your machine. Subsequent launches will skip this step.',
    progress: (completed, total) => `${completed} of ${total} steps complete`,
    currentStage: stage => ` -- now: ${stage}`,
    fetchingManifest: 'Fetching installer manifest...',
    error: 'Error',
    hideOutput: 'Hide installer output',
    showOutput: 'Show installer output',
    lines: count => `${count} line${count === 1 ? '' : 's'}`,
    noOutput: 'No output yet.',
    cancelling: 'Cancelling...',
    cancelInstall: 'Cancel install',
    transcriptSaved: 'Full transcript saved to',
    copiedOutput: 'Copied!',
    copyOutput: 'Copy output',
    reloadRetry: 'Reload and retry',
    openLogs: 'Open logs'
  },

  onboarding: {
    headerTitle: "Let's get you setup with Hermes Agent",
    headerDesc: 'Connect a model provider to start chatting. Most options take one click.',
    preparingInstall: 'Hermes is finishing install. This usually takes under a minute on first run.',
    starting: 'Starting Hermes…',
    lookingUpProviders: 'Looking up providers...',
    collapse: 'Collapse',
    otherProviders: 'Other providers',
    haveApiKey: 'I have an API key',
    chooseLater: "I'll choose a provider later",
    recommended: 'Recommended',
    connected: 'Connected',
    featuredPitch: 'One subscription, 300+ frontier models — the recommended way to run Hermes',
    fireworksPitch: 'Direct model API — Fireworks-hosted frontier models',
    localModelsTitle: 'Run models locally',
    localModelsPitch: 'No account needed — download a model and run it on this machine',
    openRouterPitch: 'One key, hundreds of models — a solid default',
    apiKeyOptions: {
      fireworks: {
        short: 'direct model API',
        description: 'Direct access to models hosted by Fireworks AI.'
      },
      openrouter: {
        short: 'one key, many models',
        description: 'Hosts hundreds of models behind a single key. Good default for new installs.'
      },
      openai: { short: 'GPT-class models', description: 'Direct access to OpenAI models.' },
      gemini: { short: 'Gemini models', description: 'Direct access to Google Gemini models.' },
      xai: { short: 'Grok models', description: 'Direct access to xAI Grok models.' },
      local: {
        short: 'self-hosted',
        description: 'Point Hermes at a local or self-hosted OpenAI-compatible endpoint (vLLM, llama.cpp, Ollama, etc).'
      }
    },
    backToSignIn: 'Back to sign in',
    getKey: 'Get a key',
    replaceCurrent: 'Replace current value',
    pasteApiKey: 'Paste API key',
    localApiKeyPlaceholder: 'API key (optional — only if your endpoint requires one)',
    localModelNamePlaceholder: 'Model name (e.g. command-a-plus-05-2026)',
    couldNotSave: 'Could not save credential.',
    connecting: 'Connecting',
    update: 'Update',
    flowSubtitles: {
      pkce: 'Opens your browser to sign in, then continues here',
      device_code: 'Opens a verification page in your browser — Hermes connects automatically',
      external: 'Sign in once in your terminal, then come back to chat'
    },
    startingSignIn: provider => `Starting sign-in for ${provider}...`,
    verifyingCode: provider => `Verifying your code with ${provider}...`,
    connectedProvider: provider => `${provider} connected`,
    connectedPicking: provider => `${provider} connected. Picking a default model...`,
    signInFailed: 'Sign-in failed. Try again.',
    signInExpired:
      'The sign-in page timed out before you finished. Try again and complete the browser step within a few minutes, or use an API key instead.',
    signInDidNotFinish: provider =>
      `Sign-in with ${provider} did not finish. Check your internet connection and try again, or pick a different provider.`,
    tryAgain: 'Try again',
    useApiKeyInstead: 'Use an API key',
    errorDetails: 'Details',
    pickDifferentProvider: 'Pick a different provider',
    signInWith: provider => `Sign in with ${provider}`,
    openedBrowser: provider => `We opened ${provider} in your browser.`,
    authorizeThere: 'Authorize Hermes there.',
    copyAuthCode: 'Copy the authorization code and paste it below.',
    pasteAuthCode: 'Paste authorization code',
    reopenAuthPage: 'Re-open authorization page',
    autoBrowser: provider =>
      `We opened ${provider} in your browser. Authorize Hermes there and you'll be connected automatically — nothing to copy or paste.`,
    reopenSignInPage: 'Re-open sign-in page',
    waitingAuthorize: 'Waiting for you to authorize...',
    externalPending: provider =>
      `${provider} signs in through its own CLI. Run this command in a terminal, then come back and pick "I've signed in":`,
    signedIn: "I've signed in",
    deviceCodeOpened: provider => `We opened ${provider} in your browser. Enter this code there:`,
    reopenVerification: 'Re-open verification page',
    copy: 'Copy',
    defaultModel: 'Default model',
    freeTier: 'Free tier',
    pro: 'Pro',
    free: 'Free',
    price: (input, output) => `${input} in / ${output} out per Mtok`,
    change: 'Change',
    startChatting: 'Begin',
    docs: provider => `${provider} docs`
  },

  freeTier: {
    providerRowTitle: 'Nous · free tier',
    providerRowPitch: 'Sign in with a Nous account to unlock more models and tools.',
    readyTitle: 'Hermes is ready.',
    readyCaption: 'Free · connectors included',
    begin: 'Begin',
    signInInstead: 'Sign in with a Nous account instead',
    otherProviders: 'Other providers',
    stripTitle: 'Free Nous inference and connectors are now available.',
    stripBody: 'Open the model picker to try them, or sign in with a Nous account.',
    openModelPicker: 'Open model picker',
    dismiss: 'Dismiss',
    providerName: 'Nous',
    statusLabel: model => `Nous · ${model}`,
    signIn: 'Sign in',
    signInHeading: 'Sign in with a Nous account to unlock more models and tools.',
    settingUp: 'Setting up free inference…',
    codeBody: 'Enter this code in your browser to finish signing in.',
    copyLink: 'Copy link',
    doNotShare: 'Do not share this code.',
    waiting: 'Waiting for sign-in…',
    finishingHeading: 'Finishing sign-in…',
    finishingBody: 'Approved in the browser. Collecting your account tokens.',
    signedInAs: email => `Signed in as ${email}`,
    signedIn: 'Signed in.',
    completedBody: 'Your account now carries inference and tools.',
    defaultModel: 'Default model',
    change: 'Change',
    done: 'Done',
    notNow: 'Not now',
    tryAgain: 'Try again',
    startAgain: 'Start again',
    didNotComplete: "Sign-in didn't finish",
    rejectedBody: "No problem, you're still on the free Nous service. Sign in whenever you're ready.",
    supersededBody: 'A newer sign-in code replaced this one. Use the newest one, or start again.',
    timedOutHeading: 'That sign-in link has expired',
    timedOutBody: "Start again whenever you're ready. You're still on the free Nous service.",
    retiredBody:
      "Your session ended before the sign-in finished. Hermes will start a new one; then sign in again whenever you're ready.",
    errorBody: "Sign-in didn't finish. Try again whenever you're ready.",
    busyHeading: 'Almost there',
    busyBody: wait =>
      `Hermes couldn't finish signing you in because the Nous service is busy. Try again in ${wait}. Your session is still here in the meantime.`,
    unreachableBody:
      "Hermes couldn't reach the Nous service to finish signing you in. Check your internet connection and try again. Your session is still here.",
    alreadySignedInHeading: 'Already signed in.',
    alreadySignedInBody: 'This Hermes is already signed in to a Nous account.',
    setupFailed: {
      gateClosed:
        "This version of Hermes can't start without a Nous account. Sign in or create one, it's free and only takes a minute.",
      paused:
        'Using Hermes without signing in is paused for a moment. Hermes will keep checking. Signing in is free and gets you going right now.',
      rateLimited: wait =>
        `Lots of people are getting started right now, so Hermes will try again in ${wait}. Signing in is free and skips the wait.`,
      unreachable:
        "Hermes couldn't reach the Nous service. Check your internet connection, then tap Try again. Or connect another provider for now.",
      serverError: 'The Nous service had a hiccup. Tap Try again in a moment, or connect another provider for now.',
      powRequired:
        "The Nous server asked for a proof of work, but that isn't implemented in your Agent yet. Sign in or create a free Nous account to continue.",
      locked: "This session can't continue without signing in. Sign in or create a free Nous account to keep going.",
      generic:
        "Hermes couldn't set up free access without signing in. Signing in is free, or connect another provider.",
      signInBelow: 'Signing in is free. Pick Nous below.',
      tryAgain: 'Try again',
      retrying: 'Trying again…'
    }
  },

  modelPicker: {
    title: 'Switch model',
    current: 'current:',
    unknown: '(unknown)',
    search: 'Filter providers and models...',
    noModels: 'No models found.',
    addProvider: 'Add provider',
    loadFailed: 'Could not load models',
    loadingIntoMemory: 'Loading into memory',
    downloading: 'Downloading',
    localDownloadsHeading: 'Local',
    noAuthenticatedProviders: 'No authenticated providers.',
    pro: 'Pro',
    proNeedsSubscription: 'Pro models need a paid Nous subscription.',
    free: 'Free',
    freeTier: 'Free tier',
    priceTitle: 'Input / Output price per million tokens',
    wasPrice: 'was',
    customModel: 'Custom model',
    addCustomModelAction: 'Add custom model…',
    customModelPlaceholder: 'Type a model id, e.g. openai/gpt-5'
  },

  modelVisibility: {
    title: 'Models',
    search: 'Search models',
    noAuthenticatedProviders: 'No authenticated providers.',
    addProvider: 'Add provider…',
    addCustomModel: 'Add custom model',
    removeCustomModel: 'Remove custom model',
    resetToDefaults: 'Reset to defaults',
    resetConfirm: 'Reset model visibility to defaults?',
    resetDescription:
      'Your shown and hidden model choices are cleared and every provider’s default list comes back. Custom models you added are kept and shown.',
    resetAction: 'Reset'
  },

  shell: {
    windowControls: 'Window controls',
    paneControls: 'Pane controls',
    appControls: 'App controls',
    modelMenu: {
      search: 'Search models',
      noModels: 'No models found',
      editModels: 'Edit models…',
      followDefault: 'Use Settings default',
      refreshModels: 'Refresh models',
      favorites: 'Favorites',
      addFavorite: 'Add to favorites',
      removeFavorite: 'Remove from favorites',
      favoriteShortcut: '⇧ Click',
      fast: 'Fast',
      free: 'free',
      cacheRead: 'cached read',
      priceTitle: (input: string, output: string, cache: string) =>
        `Input ${input}/Mtok · Output ${output}/Mtok` + (cache ? ` · Cached read ${cache}/Mtok` : '')
    },
    modelOptions: {
      noOptions: 'No options for this model',
      options: 'Options',
      thinking: 'Thinking',
      fast: 'Fast',
      effort: 'Effort',
      minimal: 'Minimal',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      xhigh: 'Extra High',
      max: 'Max',
      ultra: 'Ultra',
      sendsOnRoute: (level: string) => `sends ${level} on this route`,
      updateFailed: 'Model option update failed',
      fastFailed: 'Fast mode update failed'
    },
    gatewayMenu: {
      gateway: 'Gateway',
      connected: 'Connected',
      connecting: 'Connecting',
      offline: 'Offline',
      inferenceReady: 'Inference ready',
      inferenceNotReady: 'Inference not ready',
      checkingInference: 'Checking inference',
      disconnected: 'Disconnected',
      reconnectGateway: 'Reconnect gateway',
      openSystem: 'Open system panel',
      connection: label => `Connection: ${label}`,
      recentActivity: 'Recent activity',
      viewAllLogs: 'View all logs →',
      messagingPlatforms: 'Messaging platforms'
    },
    approvalMode: {
      title: 'Approval mode',
      ariaLabel: mode => `Approval mode: ${mode}`,
      manual: 'Manual',
      manualDescription: 'Ask before actions that require approval',
      smart: 'Smart',
      smartDescription: 'Automatically assess actions and ask when needed',
      off: 'Off',
      offDescription: 'Run without approval prompts'
    },
    statusbar: {
      unknown: 'unknown',
      restart: 'restart',
      update: 'update',
      updateInProgress: 'Update in progress',
      commitsBehind: (count, branch) => `${count} commit${count === 1 ? '' : 's'} behind ${branch}`,
      releaseAvailable: (tag: string) => `Version ${tag} is available.`,
      desktopVersion: version => `Hermes Desktop v${version}`,
      backendVersion: version => `Backend v${version}`,
      clientLabel: version => `client v${version}`,
      connectionSsh: host => `SSH: ${host}`,
      connectionRemote: host => `Remote: ${host}`,
      connectionCloud: host => `Cloud: ${host}`,
      connectionCloudTooltip: host => `Hermes Cloud · ${host}`,
      connectionSshTooltip: host => `SSH · ${host}`,
      connectionRemoteTooltip: host => `Remote · ${host}`,
      backendLabel: version => `backend v${version}`,
      commit: sha => `commit ${sha}`,
      branch: branch => `branch ${branch}`,
      closeCommandCenter: 'Close Command Center',
      openCommandCenter: 'Open Command Center',
      showTerminal: 'Show terminal',
      hideTerminal: 'Hide terminal',
      gateway: 'Gateway',
      gatewayReady: 'ready',
      gatewayNeedsSetup: 'needs setup',
      gatewayUnavailable: 'inference unavailable',
      gatewayChecking: 'checking',
      gatewayConnecting: 'connecting',
      gatewayOffline: 'offline',
      gatewayRestarting: 'restarting…',
      gatewayTitle: 'Gateway',
      customizeTitle: 'Show in status bar',
      hideStatusbar: 'Hide status bar',
      resetStatusbar: 'Reset to defaults',
      toggleApprovalMode: 'Approvals',
      toggleBackendVersion: 'Backend version',
      toggleCacheHitRate: 'Cache hit rate',
      toggleCommandCenter: 'Command Center',
      toggleContextUsage: 'Context meter',
      toggleRunningTimer: 'Turn timer',
      toggleSessionTimer: 'Session timer',
      toggleTerminal: 'Terminal',
      toggleTokensPerSecond: 'Tokens per second',
      toggleVersion: 'Version & updates',
      toggleFreeTier: 'Free tier',
      toggleWorkspace: 'Workspace',
      cacheHitRateTitle: 'Prompt cache hit rate this session — cached tokens cost less, so higher is cheaper',
      tokensPerSecondTitle: 'Output tokens per second, averaged over the last 10 model calls',
      agents: 'Agents',
      closeAgents: 'Close agents',
      openAgents: 'Open agents',
      subagents: count => `${count} subagent${count === 1 ? '' : 's'}`,
      failed: count => `${count} failed`,
      running: count => `${count} running`,
      cron: 'Cron',
      openCron: 'Open cron jobs',
      webhooks: 'Webhooks',
      openWebhooks: 'Open webhooks',
      starmap: 'Memory Graph',
      openStarmap: 'Open memory graph',
      turnRunning: 'Running',
      contextUsage: 'Context usage',
      compressions: count => `Compressions: ${count}`,
      systemResources: {
        title: 'System Resources',
        loading: 'Resources…',
        gpuUtilization: 'GPU utilization',
        gpuMemory: 'GPU memory',
        ram: 'RAM',
        unifiedNote: 'Unified memory — the GPU and system share this pool.',
        toggle: 'System resources'
      },
      contextUsagePanel: {
        categories: {
          conversation: 'Conversation',
          mcp: 'MCP',
          memory: 'Memory',
          rules: 'Rules',
          skills: 'Skills',
          subagent_definitions: 'Subagent definitions',
          system_prompt: 'System prompt',
          tool_definitions: 'Tool definitions'
        },
        empty: 'No context data yet',
        loading: 'Loading breakdown…',
        percentFull: percent => `${percent}% Full`,
        title: 'Context Usage',
        tokenSummary: (used, max) => `${used} / ${max} Tokens`
      },
      focusedSince: 'Focused since',
      focusedSinceTitle: 'Time since this chat was focused — not how long a turn has been running',
      yoloOn: 'YOLO on — auto-approving dangerous commands. Shift+click toggles globally.',
      yoloOff: 'YOLO off. Shift+click toggles globally.',
      modelNone: 'none',
      noModel: 'no model',
      switchModel: 'Switch model',
      openModelPicker: 'Open model picker',
      modelPinned: 'pinned by you; new chats use this instead of the Settings default',
      modelTitle: (provider, model) => `Model · ${provider}: ${model}`,
      providerModelTitle: (provider, model) => `${provider} · ${model}`
    }
  },

  rightSidebar: {
    terminalReadOnly: 'Read-only output',
    terminalReadOnlyHelp:
      'To answer prompts, stop the background command and run it in a new terminal. The new terminal opens a separate shell; it does not connect to this process.',
    terminalOpenInteractive: 'Open new terminal',
    aria: 'Right sidebar',
    panelsAria: 'Right sidebar panels',
    files: 'File system',
    terminal: 'Terminal',
    noFolderSelected: 'No folder selected',
    changeCwdTitle: 'Change working directory',
    remotePickerTitle: 'Choose remote folder',
    remotePickerDescription: 'Browse folders on the connected backend.',
    remotePickerSelect: 'Select folder',
    remotePickerNewFolder: 'New folder',
    remotePickerFolderName: 'Folder name',
    remotePickerCreateFolder: 'Create folder',
    remotePickerInvalidFolderName: 'Enter a single folder name, without slashes.',
    remotePickerCreateFolderFailed: error => `Could not create the folder (${error}).`,
    folderTip: cwd => cwd,
    openFolder: 'Open folder',
    refreshTree: 'Refresh tree',
    collapseAll: 'Collapse all folders',
    showIgnored: 'Show gitignored files',
    hideIgnored: 'Hide gitignored files',
    previewUnavailable: 'Preview unavailable',
    couldNotPreview: path => `Could not preview ${path}`,
    noProjectTitle: 'No project',
    noProjectBody: 'Open a project to browse its files and review changes.',
    noProjectOpen: 'No project open',
    noDiffs: 'No diffs',
    unreadableTitle: 'Unreadable',
    unreadableBody: error => `Could not read this folder (${error}).`,
    emptyTitle: 'Empty',
    emptyBody: 'This folder is empty.',
    treeErrorTitle: 'Tree error',
    treeErrorBody: 'The file tree hit an error rendering this folder.',
    tryAgain: 'Try again',
    loadingTree: 'Loading file tree',
    loadingFiles: 'Loading files',
    terminalHide: 'Hide terminal',
    terminalsAria: 'Terminals',
    terminalNew: 'New terminal',
    terminalCloseOthers: 'Close others',
    terminalCloseAll: 'Close all',
    addToChat: 'Add to chat'
  },

  preview: {
    tab: 'Preview',
    pin: 'Pin to workspace',
    unpin: 'Unpin from workspace',
    closePane: 'Close preview pane',
    loading: 'Loading preview',
    unavailable: 'Preview unavailable',
    missingTarget: 'That path does not exist on this computer',
    missingTitle: 'File no longer exists',
    missingBody: label =>
      `${label} was deleted, moved, or its temporary location was cleared. This tab will not be restored on the next launch.`,
    opening: 'Opening...',
    hide: 'Hide',
    openPreview: 'Open preview',
    openInBrowser: 'Open in browser',
    openInExternal: 'Open in external',
    popIn: 'Pop in',
    popOut: 'Pop out',
    linkHint: '⌘/Ctrl-click for preview pane',
    sourceLineTitle: 'Click to select · shift-click to extend · drag to composer',
    source: 'SOURCE',
    renderedPreview: 'PREVIEW',
    diff: 'DIFF',
    unknownSize: 'unknown size',
    binaryTitle: 'This looks like a binary file',
    binaryBody: label => `Previewing ${label} may show unreadable text.`,
    largeTitle: 'This file is large',
    largeBody: (label, size) => `${label} is ${size}. Hermes will only show the first 512 KB.`,
    previewAnyway: 'Preview anyway',
    truncated: 'Showing first 512 KB.',
    noInlineTitle: 'No inline preview',
    noInlineBody: mimeType => `${mimeType || 'This file type'} can still be attached as context.`,
    edit: 'Edit',
    editing: 'Editing',
    unsavedChanges: 'Unsaved changes',
    saveFailed: message => `Couldn't save: ${message}`,
    diskChangedTitle: 'File changed on disk',
    diskChangedBody:
      'This file changed since you opened it. Overwrite it with your version, or discard your edits and reload?',
    overwrite: 'Overwrite',
    discardReload: 'Discard & reload',
    console: {
      deselect: 'Deselect entry',
      select: 'Select entry',
      copyFailed: 'Could not copy console output',
      copyEntry: 'Copy this entry',
      sendEntry: 'Send this entry to chat',
      messages: count => `${count} console messages`,
      resize: 'Resize preview console',
      title: 'Preview Console',
      selected: count => `${count} selected`,
      sendToChat: 'Send to chat',
      copySelected: 'Copy selected to clipboard',
      copyAll: 'Copy all to clipboard',
      copy: 'Copy',
      clear: 'Clear',
      empty: 'No console messages yet.',
      promptHeader: 'Preview console:',
      sentTitle: 'Sent to chat',
      sentMessage: count => `${count} log entr${count === 1 ? 'y' : 'ies'} added to composer`
    },
    web: {
      appFailedToBoot: 'Preview app failed to boot',
      serverNotFound: 'Server not found',
      remoteLoopback:
        'This address points at the machine running your agent, not this one. The browser pane loads pages locally, so a remote dev server needs a port forward or a reachable hostname.',
      failedToLoad: 'Preview failed to load',
      tryAgain: 'Try again',
      restarting: 'Hermes is restarting...',
      askRestart: 'Ask Hermes to restart the server',
      lookingRestart: taskId => `Hermes is looking for a preview server to restart (${taskId})`,
      restartingTitle: 'Restarting preview server',
      restartingMessage: 'Hermes is working in the background. Watch the preview console for progress.',
      startRestartFailed: message => `Could not start server restart: ${message}`,
      restartFailed: 'Server restart failed',
      hideConsole: 'Hide preview console',
      showConsole: 'Show preview console',
      hideDevTools: 'Hide preview DevTools',
      openDevTools: 'Open preview DevTools',
      goBack: 'Back',
      goForward: 'Forward',
      reload: 'Reload page',
      address: 'Address',
      addressPlaceholder: 'Enter address',
      blankPageBody: 'Type an address above to browse, or ask Hermes to open a page.',
      finishedRestarting: message => `Hermes finished restarting the preview server${message ? `: ${message}` : ''}`,
      failedRestarting: message => `Server restart failed: ${message}`,
      unknownError: 'unknown error',
      restartedTitle: 'Preview server restarted',
      reloadingNow: 'Reloading the preview now.',
      restartFailedTitle: 'Preview restart failed',
      restartFailedMessage: 'Hermes could not restart the server.',
      stillWorking:
        'Hermes is still working, but no restart result has arrived yet. The server command may be running in the foreground.',
      workspaceReloading: 'Workspace changed, reloading preview',
      fileChanged: url => `File changed, reloading preview: ${url}`,
      filesChanged: (count, url) => `${count} file changes, reloading preview: ${url}`,
      watchFailed: message => `Could not watch preview file: ${message}`,
      moduleMimeDescription:
        'Module scripts are being served with the wrong MIME type. This usually means a static file server is serving a Vite/React app instead of the project dev server.',
      loadFailedConsole: (code, message) => `Load failed${code ? ` (${code})` : ''}: ${message}`,
      unreachableDescription: 'The preview page could not be reached.',
      openTarget: url => `Open ${url}`,
      fallbackTitle: 'Preview',
      annotate: 'Annotate',
      annotateOn: 'Stop annotating',
      annotateNeedPage: 'Open a page in the in-app browser first.',
      annotateFailed: 'Could not start annotation mode',
      commenting: 'Commenting',
      addComments: count => (count === 1 ? 'Add 1 comment' : `Add ${count} comments`),
      commentPlaceholder: 'Add a comment...',
      commentTitle: n => `Comment ${n}`,
      saveComment: 'Save',
      cancelComment: 'Cancel comment'
    }
  },

  interfaceMode: {
    title: 'Interface mode',
    hint: 'Changes what is shown, not what Hermes can do.',
    sessionNote: 'Set by Simple mode. A change here lasts for this session; switch to Advanced to make it yours.',
    simple: {
      label: 'Simple',
      description: 'For talking to Hermes. Sidebar and chat; no terminal, file or diff panes.'
    },
    advanced: {
      label: 'Advanced',
      description: 'For developers. Terminal, files, diffs, statusbar and layouts, as you set them.'
    }
  },

  zones: {
    showTabStrip: 'Show tabs',
    hideTabStrip: 'Hide tabs',
    showStripTab: title => `Show ${title}`,
    hideStripTab: title => `Hide ${title}`,
    zoneMenuLabel: title => `Zone options for ${title}`,
    lastTabKeptTitle: 'Last tab stays',
    lastTabKeptBody: 'This zone needs at least one visible tab. Show another tab first, or collapse the whole sidebar.',
    toggleStripTab: title => `Toggle ${title} tab`,
    minimize: 'Minimize',
    restore: 'Restore',
    closeRunningTitle: 'Close running tab?',
    closeRunningBody:
      'This chat is still working (or waiting on your input). Closing the tab hides it — the session keeps its progress and can be reopened from the sidebar.',
    closeRunningConfirm: 'Close tab',
    reload: 'Reload',
    closeOthers: 'Close others',
    closeToRight: 'Close to the right',
    closeAll: 'Close all',
    newSessionTab: 'New session tab',
    newTab: 'New tab',
    pluginDisabled: pluginId => `Plugin "${pluginId}" disabled`,
    pluginDisabledBody: 'Re-enable it in Capabilities → Plugins to bring the pane back.',
    missingPane: paneId => `missing pane: ${paneId}`,
    editTitle: 'Layouts',
    editHint: 'Pick a layout, or drag panes between zones.',
    reset: 'Reset',
    templates: 'Templates',
    custom: 'Custom',
    newGridLayout: 'New grid layout',
    saveCurrentAs: 'Save current arrangement as a template',
    nameLayoutPlaceholder: 'Name this layout…',
    deletePreset: name => `Delete ${name}`,
    zoneEditorTitle: 'Zone editor',
    editorHintPre: 'click to split · ',
    editorHintPost: ' flips the line · drag across zones to merge · drag shared edges to resize',
    templateColumns: 'Columns',
    templateRows: 'Rows',
    templateGrid: 'Grid',
    templatePriority: 'Priority',
    zoneTag: index => `zone ${index}`,
    mergeZones: count => `Merge ${count} zones`,
    customZoneName: count => `Custom ${count}-zone`,
    layoutNamePlaceholder: fallback => `Layout name (${fallback})`,
    saveApply: 'Save & apply',
    notExpressible: 'this arrangement interlocks (pinwheel) — not expressible as nested splits yet',
    zoneCount: count => `${count} zones`,
    tabCount: count => `${count} tabs`
  },

  contextMenu: {
    link: {
      openInApp: 'Open in in-app browser',
      openExternal: 'Open in external browser',
      copyUrl: 'Copy URL',
      copyResolvedUrl: 'Copy resolved URL'
    },
    image: {
      copyImage: 'Copy image',
      copyImageAddress: 'Copy image address',
      saveImageAs: 'Save image as…'
    },
    edit: {
      cut: 'Cut',
      paste: 'Paste',
      selectAll: 'Select all',
      addToDictionary: 'Add to dictionary'
    },
    page: {
      copyPageUrl: 'Copy page URL',
      inspectElement: 'Inspect element'
    }
  },

  assistant: {
    thread: {
      loadingSession: 'Loading session',
      showEarlier: 'Show earlier messages',
      loadingResponse: 'Hermes is loading a response',
      loadingLocalModel: model => `Loading ${model} into memory`,
      processingPrompt: 'Processing prompt',
      resumeWhenBackgroundDone: count =>
        count === 1
          ? 'Will resume when the background task finishes'
          : `Will resume when ${count} background tasks finish`,
      thinking: 'Thinking',
      thought: 'Thought',
      thoughtBriefly: 'Thought briefly',
      thoughtFor: duration => `Thought for ${duration}`,
      completedSteps: count => `Completed ${count} steps`,
      completedStepsIn: (count, duration) => `Completed ${count} steps in ${duration}`,
      turnDuration: duration => `This turn took ${duration}`,
      today: time => `Today, ${time}`,
      yesterday: time => `Yesterday, ${time}`,
      copy: 'Copy',
      refresh: 'Refresh',
      moreActions: 'More actions',
      branchNewChat: 'Branch in new chat',
      react: 'React',
      dismissError: 'Dismiss error',
      responseStopped: 'Response stopped',
      errorLayers: {
        auth: 'Sign-in problem',
        billing: 'Out of credits',
        disk: 'Disk full',
        endpoint: "Can't reach your model server",
        gateway: 'Hermes hit a problem',
        generic: "Hermes couldn't finish this reply",
        provider: 'The AI service returned an error',
        runtime: 'Hermes hit a problem',
        streaming: 'The reply was cut off'
      },
      errorLayerBodies: {
        auth: 'The AI service rejected your sign-in. Check the credentials for this provider, then send your message again.',
        billing: 'Your account has no credits left for this provider. Top up or switch provider, then send again.',
        disk: 'Your disk is full, so Hermes could not save this conversation. Free some space, then retry.',
        endpoint:
          "Hermes can't reach your custom model server. Check that it is running, then send your message again.",
        gateway:
          'Hermes hit an internal problem starting this reply. Send your message again; if it keeps happening, send diagnostics.',
        generic: 'Something went wrong while Hermes was replying. Retry, or copy the details if it keeps happening.',
        provider: 'The AI service could not complete this request. Retry in a moment or switch provider.',
        runtime:
          'Hermes hit an internal problem starting this reply. Send your message again; if it keeps happening, send diagnostics.',
        streaming: 'The connection dropped before the reply finished. Retry to send it again.'
      },
      errorCodes: {
        auth: {
          title: provider => `${provider} rejected your sign-in`,
          body: provider =>
            `The credentials saved for ${provider} were not accepted. Fix them in Settings or switch provider, then send your message again.`
        },
        auth_permanent: {
          title: provider => `${provider} rejected your sign-in`,
          body: provider =>
            `The credentials saved for ${provider} are invalid or were revoked. Update them or switch provider, then send your message again.`
        },
        billing: {
          title: 'Out of credits',
          body: provider => `Your ${provider} account has no credits left. Top up or switch provider, then send again.`
        },
        rate_limit: {
          title: 'The AI service is busy',
          body: provider => `${provider} is limiting requests right now. Wait a minute, then retry.`
        },
        upstream_rate_limit: {
          title: 'The AI service is busy',
          body: provider => `${provider} is limiting requests right now. Wait a minute, then retry.`
        },
        overloaded: {
          title: 'The AI service is overloaded',
          body: provider => `${provider} is having problems right now. Retry in a moment or switch provider.`
        },
        server_error: {
          title: 'The AI service had a problem',
          body: provider => `${provider} returned a server error. Retry in a moment or switch provider.`
        },
        timeout: {
          title: 'Could not reach the AI service',
          body: provider =>
            `${provider} could not be reached or did not answer in time. Check your internet connection, then retry.`
        },
        stream_drop: {
          title: 'The reply was cut off',
          body: 'The connection dropped before the reply finished. Retry to send it again.'
        },
        no_reply: {
          title: "The reply didn't finish",
          body: 'Hermes ended this turn without a reply. Retry to send it again.'
        },
        upstream_blocked: {
          title: 'A firewall blocked the request',
          body: provider =>
            `A firewall or CDN in front of ${provider} blocked the request before it reached the model — your key is probably fine. Set a User-Agent header via the provider's extra_headers in Settings, or switch provider, then send your message again.`
        },
        ssl_cert_verification: {
          title: 'Secure connection failed',
          body: provider =>
            `Hermes could not verify the secure connection to ${provider}. Check your network or proxy settings, or switch provider, then send your message again.`
        },
        context_overflow: {
          title: 'This conversation is too long',
          body: 'The conversation no longer fits the model. Compress it or start a new chat, then send again.'
        },
        payload_too_large: {
          title: 'This message is too large',
          body: 'The request was too big for the model. Compress the conversation or start a new chat, then send again.'
        },
        model_not_found: {
          title: 'This model is not available',
          body: provider =>
            `${provider} does not offer this model on your account. Choose another model, then send your message again.`
        },
        provider_policy_blocked: {
          title: 'This model is blocked by your account settings',
          body: provider =>
            `${provider} would not route this request under your account's data or privacy settings. Choose another model or switch provider.`
        },
        content_policy_blocked: {
          title: 'The AI service declined this request',
          body: provider => `${provider} would not answer this message. Edit it and send again.`
        },
        format_error: {
          title: 'The AI service rejected the request',
          body: provider =>
            `${provider} did not accept how this request was built. Switch provider or send diagnostics so we can look into it.`
        },
        truncated: {
          title: 'The reply was cut short',
          body: 'The model stopped before finishing. Retry to get a complete reply.'
        },
        invalid_response: {
          title: 'The AI service sent an unreadable reply',
          body: provider => `${provider} returned something Hermes could not read. Retry in a moment.`
        },
        empty_response: {
          title: 'The AI service sent an empty reply',
          body: provider => `${provider} returned nothing for this message. Retry in a moment.`
        },
        loop_error: {
          title: 'Hermes got stuck in a loop',
          body: 'The reply kept repeating the same steps, so Hermes stopped it. Retry, or start a new chat if it happens again.'
        },
        SESSION_NOT_OWNED: {
          title: 'This chat is open somewhere else',
          body: 'This chat is currently open in another Hermes window or terminal. Close it there and send your message again, or start a new chat here.'
        },
        disk_full: {
          title: 'Disk full',
          body: 'Your disk is full, so Hermes could not save this conversation. Free some space, then retry.'
        },
        // Nous free tier. The body is normally the backend's own sentence (it names the wait
        // and the way forward); these bodies stand in for an older backend that sent none.
        free_tier_disabled: {
          title: 'Using Hermes without signing in is switched off right now',
          body: "Sign in with a Nous account to keep chatting, it's free."
        },
        free_tier_rate_limited: {
          title: "You've used up the allowance for chatting without signing in",
          body: "It refreshes shortly. Sign in with a Nous account for a bigger allowance, it's free."
        },
        free_tier_at_capacity: {
          title: 'Chatting without signing in is really busy right now',
          body: "Sign in to skip the queue, it's free, or try again in a little while."
        },
        free_tier_model_not_free: {
          title: "That model isn't available without signing in",
          body: "Hermes uses the free model for now. Sign in with a Nous account for more models, it's free."
        },
        free_tier_route: {
          title: "Hermes couldn't reach the free model on this route",
          body: "Sign in with a Nous account, it's free, or check the NOUS_INFERENCE_BASE_URL setting."
        },
        free_tier_outage: {
          title: 'The free model is having trouble responding right now',
          body: 'Try sending your message again in a minute.'
        },
        free_tier_refused: {
          title: "Hermes couldn't send that without signing in",
          body: 'Signing in with a Nous account is free.'
        }
      },
      errorAuthKinds: {
        api_key: {
          title: provider => `${provider} rejected your API key`,
          body: provider => `The key saved for ${provider} is invalid or was revoked. Update it, then retry.`
        },
        oauth: {
          title: provider => `Your ${provider} sign-in expired`
        }
      },
      errorDetails: 'Details',
      errorGenericProvider: 'The AI service',
      errorToastTitle: "Hermes couldn't finish the reply",
      errorRetry: 'Retry',
      errorLimitResets: time => `Limit resets at ${time}`,
      errorRetryAtReset: time => `Retry when the limit resets (${time})`,
      errorRetryScheduled: (time, wait) => `Retrying at ${time} — in ${wait}`,
      errorRetryScheduledCancel: 'Cancel',
      errorStartNewSession: 'Start new session',
      errorSwitchProvider: 'Switch provider',
      errorChooseModel: 'Choose a model',
      errorCompressConversation: 'Compress conversation',
      errorCompressFailed: 'Could not compress the conversation',
      errorOpenHermesFolder: 'Open Hermes folder',
      errorOpenHermesFolderFailed: 'Could not open the Hermes folder',
      errorUpdateApiKey: 'Update API key',
      errorSignInAgain: provider => `Sign in to ${provider} again`,
      errorSignInFreeTier: 'Sign in with a Nous account',
      errorOauthExpired: provider =>
        `Your ${provider} sign-in has expired or was revoked. Sign in again to keep chatting.`,
      errorOpenLogs: 'Open logs',
      errorOpenLogsFailed: 'Could not open the logs folder',
      errorOpenDesktopLogs: 'Open Desktop logs',
      errorCopyDiagnostics: 'Copy error details',
      errorSendDiagnostics: 'Send diagnostics',
      filesChanged: count => (count === 1 ? '1 file changed' : `${count} files changed`),
      reviewChanges: 'Review',
      readAloudFailed: 'Read aloud failed',
      preparingAudio: 'Preparing audio...',
      stopReading: 'Stop reading',
      readAloud: 'Read aloud',
      copyFullResponse: 'Copy full response',
      readAloudFullResponseHint: 'Shift-click: read the full response',
      editMessage: 'Edit message',
      expandMessage: 'Expand message',
      scrollToBottom: 'Scroll to bottom',
      stop: 'Stop',
      restorePrevious: 'Restore previous checkpoint',
      restoreCheckpoint: 'Restore checkpoint',
      restoreFromHere: 'Restore checkpoint — rerun from this prompt',
      restoreTitle: 'Restore to this checkpoint?',
      restoreBody:
        'Everything after this prompt is removed from the conversation, and the prompt runs again from here.',
      restoreConfirm: 'Restore & rerun',
      restoreNext: 'Restore next checkpoint',
      goForward: 'Go forward',
      sendEdited: 'Send edited message',
      attachingFile: 'Attaching…'
    },
    approval: {
      gatewayDisconnected:
        'Hermes is offline right now. The command is still waiting for your answer. Reconnect, then send it again.',
      sendFailed: 'Could not send your answer',
      reconnect: 'Reconnect',
      timedOutSystemLine:
        'Approval timed out — the command was not run. Ask Hermes to try again, or raise the limit in Settings → Safety → Approval timeout.',
      openSafetySettings: 'Open Safety settings',
      run: 'Run',
      command: 'Command',
      commandDetails: 'Command details',
      moreOptions: 'More approval options',
      allowSession: 'Allow this session',
      alwaysAllowMenu: 'Always allow…',
      jumpToApproval: 'Approval needed',
      reject: 'Reject',
      alwaysTitle: 'Always allow this command?',
      alwaysDescription: pattern =>
        `This adds the “${pattern}” pattern to your permanent allowlist (~/.hermes/config.yaml). Hermes won’t ask again for commands like this — in this session or any future one.`,
      alwaysAllow: 'Always allow'
    },
    clarify: {
      notReady: 'Clarify request is not ready yet',
      gatewayDisconnected: 'Hermes is offline right now. Reconnect, then send it again.',
      sendFailed: 'Could not send clarify response',
      loadingQuestion: 'Loading question…',
      other: 'Other (type your answer)',
      placeholder: 'Type your answer…',
      skip: 'Skip',
      skipped: 'Skipped',
      noAnswer: 'No answer',
      confirmAndContinueLabel: 'Confirm and continue',
      singleSelectHint: 'Pick one',
      multiSelectHint: 'Select all that apply',
      questionProgress: (answered, total) => `${answered} of ${total} answered`,
      notDelivered:
        "This question didn't reach the app, so it can't be answered here. Press Stop to end the turn, then reply in chat."
    },
    catalogInstall: {
      preparing: 'Preparing the install…',
      install: 'Install',
      advanced: 'Advanced',
      skip: 'Skip',
      installing: 'Installing…',
      installed: 'Installed',
      notInstalled: 'Not installed',
      failed: 'Failed',
      showNames: 'show names',
      hideNames: 'hide names',
      skill: name => `skill ${name}`,
      kind: { plugin: 'plugin', skill: 'skill' },
      tier: { official: 'official', community: 'community' },
      targetProfile: profile => `Installs into your ${profile} profile`,
      sendFailed: 'Could not send your answer. Try again.',
      commitLabel: 'Commit',
      subdirLabel: 'Folder',
      securityHeading: 'Security',
      scan: { passed: 'Scan passed', warnings: 'Scan found warnings', failed: 'Scan failed' },
      requirementsLabel: 'Requires',
      credentialsHeading: 'Credentials'
    },
    mcpSetup: {
      installTitle: 'Add MCP servers',
      enableTitle: 'Enable MCP servers',
      authorizeTitle: 'Authorize MCP servers',
      installAction: 'Install',
      enableAction: 'Enable',
      authorizeAction: 'Authorize',
      installed: server => `Installed ${server}`,
      enabled: server => `Enabled ${server}`,
      authorized: server => `Authorized ${server}`,
      failed: server => `Setup failed for ${server}`,
      toolCount: count => (count === 1 ? '1 tool' : `${count} tools`),
      envRequired: 'Fill in the required credentials first',
      sendFailed: 'Could not send MCP setup response',
      reloadFailed: 'Server saved, but reloading MCP tools failed — they load next session',
      gatewayDisconnected: 'Hermes is offline right now. Reconnect, then send it again.'
    },
    tool: {
      copyCode: 'Copy code',
      renderingImage: 'Rendering image',
      copyOutput: 'Copy output',
      copyCommand: 'Copy command',
      copyContent: 'Copy content',
      copyUrl: 'Copy URL',
      copyResults: 'Copy results',
      copyQuery: 'Copy query',
      copyFile: 'Copy file',
      copyPath: 'Copy path',
      failedCalls: (count: number) => `${count} tool call${count === 1 ? '' : 's'} failed`,
      skillActivity: {
        loading: 'Loading skill',
        loaded: 'Loaded skill',
        loadFailed: 'Failed to load skill',
        readingResource: 'Reading skill resource',
        readResource: 'Read skill resource',
        resourceFailed: 'Failed to read skill resource',
        listing: 'Listing skills',
        listed: 'Listed skills',
        listFailed: 'Failed to list skills',
        unavailable: 'Skill result unavailable'
      },
      outputAlt: 'Tool output',
      rawResponse: 'Raw response',
      copyActivity: 'Copy activity',
      recoveredOne: 'Recovered after 1 failed step',
      recoveredMany: count => `Recovered after ${count} failed steps`,
      failedOne: '1 step failed',
      failedMany: count => `${count} steps failed`,
      statusRunning: 'Running',
      statusError: 'Error',
      statusRecovered: 'Recovered',
      statusDone: 'Done',
      resultUnavailable: 'Result unavailable',
      resultInterrupted: 'Interrupted',
      memoryWriteNoted: 'Memory write noted',
      actions: {
        read: 'Read',
        reading: 'Reading',
        opened: 'Opened',
        opening: 'Opening',
        failedToOpen: 'Failed to open',
        searched: 'Searched',
        searching: 'Searching',
        ran: 'Ran',
        running: 'Running',
        ranCode: 'Ran code',
        runningCode: 'Scripting'
      },
      prefixes: {
        browser: 'Browser',
        web: 'Web'
      },
      titleTemplates: {
        actionCommand: (action, command) => `${action} ${command}`,
        actionQuoted: (action, value) => `${action} “${value}”`,
        actionTarget: (action, target) => `${action} ${target}`,
        prefixedDone: (prefix, action) => `${prefix} ${action}`,
        runningPrefixedTool: (prefix, action) => `Running ${prefix.toLowerCase()} ${action.toLowerCase()}`,
        runningTool: action => `Running ${action.toLowerCase()}`
      },
      titles: {
        browser_click: { done: 'Clicked page element', pending: 'Clicking page element', pendingAction: 'Clicking' },
        browser_fill: { done: 'Filled form field', pending: 'Filling form field', pendingAction: 'Filling' },
        browser_navigate: { done: 'Opened page', pending: 'Opening page', pendingAction: 'Opening' },
        browser_snapshot: {
          done: 'Captured page snapshot',
          pending: 'Capturing page snapshot',
          pendingAction: 'Capturing'
        },
        browser_take_screenshot: {
          done: 'Captured screenshot',
          pending: 'Capturing screenshot',
          pendingAction: 'Capturing'
        },
        browser_type: { done: 'Typed on page', pending: 'Typing on page', pendingAction: 'Typing' },
        clarify: { done: 'Asked a question', pending: 'Asking a question', pendingAction: 'Asking' },
        cronjob: { done: 'Cron job', pending: 'Scheduling cron job', pendingAction: 'Scheduling' },
        edit_file: { done: 'Edited file', pending: 'Editing file', pendingAction: 'Editing' },
        execute_code: { done: 'Ran code', pending: 'Scripting', pendingAction: 'Scripting' },
        image_generate: { done: 'Generated image', pending: 'Generating image', pendingAction: 'Generating' },
        list_files: { done: 'Listed files', pending: 'Listing files', pendingAction: 'Listing' },
        memory: { done: 'Saved to memory', pending: 'Saving to memory', pendingAction: 'Saving' },
        patch: { done: 'Patched file', pending: 'Patching file', pendingAction: 'Patching' },
        read_file: { done: 'Read file', pending: 'Reading file', pendingAction: 'Reading' },
        search_files: { done: 'Searched files', pending: 'Searching files', pendingAction: 'Searching' },
        session_search_recall: {
          done: 'Searched session history',
          pending: 'Searching session history',
          pendingAction: 'Searching'
        },
        terminal: { done: 'Ran command', pending: 'Running command', pendingAction: 'Running' },
        todo: { done: 'Updated todos', pending: 'Updating todos', pendingAction: 'Updating' },
        vision_analyze: { done: 'Analyzed image', pending: 'Analyzing image', pendingAction: 'Analyzing' },
        web_extract: { done: 'Read webpage', pending: 'Reading webpage', pendingAction: 'Reading' },
        web_search: { done: 'Searched web', pending: 'Searching web', pendingAction: 'Searching' },
        write_file: { done: 'Edited file', pending: 'Editing file', pendingAction: 'Editing' }
      }
    }
  },

  prompts: {
    gatewayDisconnected: 'Hermes is offline right now. Reconnect, then send it again.',
    reconnect: 'Reconnect',
    sudoSendFailed: 'Could not send sudo password',
    secretSendFailed: 'Could not send secret',
    sudoTitle: 'Administrator password',
    sudoDesc:
      'Review the command before entering your sudo password. Your password is sent to the agent running it and cached for this session.',
    sudoCommandUnavailable:
      'This agent did not provide the command. Cancel if you cannot verify it in the conversation.',
    sudoInstallDesc:
      'Hermes needs your sudo password to install the Bot Screen packages (TigerVNC + Xfce) on the gateway host. It is sent only to that host.',
    sudoPlaceholder: 'sudo password',
    secretTitle: 'Secret required',
    secretDesc: 'Hermes needs a credential to continue.',
    secretPlaceholder: 'secret value',
    vaultUnlockSendFailed: 'Could not send master password',
    vaultUnlockTitle: name => `Unlock ${name}`,
    vaultUnlockDesc: name =>
      `The agent wants to sign into a site with a login saved in ${name}. Enter your master password to unlock it for this session — it goes straight to ${name} on this machine and is never stored or shown to the agent.`,
    vaultUnlockPlaceholder: 'Master password',
    vaultUnlockKeepLocked: 'Keep locked',
    vaultUnlockConfirm: 'Unlock',
    vaultSaveSendFailed: 'Could not save the login',
    vaultSaveTitle: site => `Save your ${site} login?`,
    vaultSaveDesc: origin =>
      `Hermes reached a sign-in page at ${origin} and has no login for it. Enter it once here; it is encrypted on this machine and filled into the page without the model ever seeing the password.`,
    vaultSaveIdentifierLabel: 'Email or username',
    vaultSaveIdentifierPlaceholder: 'you@example.com',
    vaultSavePasswordPlaceholder: 'Password',
    vaultSaveFootnote: 'Manage saved logins in Settings → Passwords & Logins.',
    vaultSaveDecline: "Don't save",
    vaultSaveConfirm: 'Save & sign in',
    vaultCodeSendFailed: 'Could not send the code',
    vaultCodeTitle: site => `Verification code for ${site}`,
    vaultCodeDesc: site =>
      `${site} is asking for a one-time code (text message, email or authenticator app). Enter it here and Hermes types it into the page; the model never sees it.`,
    vaultCodeLabel: 'Code',
    vaultCodeFootnote:
      'Tip: save the authenticator key with this login in Settings → Passwords & Logins and Hermes enters codes for you.',
    vaultCodeSkip: 'Skip',
    vaultCodeConfirm: 'Enter code'
  },

  desktop: {
    audioReadFailed: 'Could not read recorded audio',
    sessionUnavailable: 'Session unavailable',
    createSessionFailed: 'Could not create a new session',
    promptFailed: 'Prompt failed',
    staleSessionTitle: 'Chat out of date',
    staleSessionBody:
      'This window was behind another view of the same chat. Latest messages were loaded. Send again if you still want to.',
    providerCredentialRequired: 'Add a provider credential before sending your first message.',
    emptySlashCommand: 'empty slash command',
    slashCommandIgnoredTitle: 'Command not sent',
    slashCommandIgnoredBody:
      'Slash commands cannot be combined with attachments. Remove the attachment or send the command separately.',
    desktopCommands: 'Desktop commands',
    skillCommandsAvailable: count => `${count} skill commands available.`,
    warningLine: message => `warning: ${message}`,
    yoloArmed: 'YOLO armed for this chat',
    yoloOff: 'YOLO off',
    yoloSystem: active => `YOLO ${active ? 'on' : 'off'} for this session`,
    yoloTitle: 'YOLO',
    yoloToggleFailed: 'Could not toggle YOLO',
    profileStatus: current =>
      `Profile: ${current}. Use /profile <name> or the "New session" picker to start a chat in another profile.`,
    unknownProfile: 'Unknown profile',
    noProfileNamed: (target, available) => `No profile named "${target}". Available: ${available}`,
    newChatsProfile: name => `New chats will use profile ${name}.`,
    setProfileFailed: 'Failed to set profile',
    sttDisabled: 'Speech-to-text is disabled in settings.',
    stopFailed: 'Stop failed',
    regenerateFailed: 'Regenerate failed',
    editFailed: 'Edit failed',
    editTurnUnavailable: 'This turn is no longer in server history (it may have been compressed away).',
    resumeFailed: 'Resume failed',
    readOnlyTranscriptTitle: 'Opened read-only',
    readOnlyTranscriptBody:
      'No connected backend claims this older chat yet, so it opened as a read-only transcript. Its history is intact; sending is disabled until a backend claims it.',
    readOnlyTranscriptSendBlocked: 'This chat is open as a read-only transcript — sending is disabled.',
    resumeStrandedTitle: "Couldn't load this session",
    resumeStrandedBody:
      'The connection to this session failed and automatic retries gave up. Check that the gateway is running, then try again.',
    poolSlotTimeoutBody:
      "Too many bots are running at once for this computer's limit. Raise the limit in Settings → Advanced, or wait for one to finish and retry.",
    poolSlotTimeoutOpenSettings: 'Open Advanced Settings',
    resumeRetry: 'Retry',
    nothingToBranch: 'Nothing to branch',
    branchNeedsChat: 'Start or resume a chat before branching.',
    sessionBusy: 'Session busy',
    branchStopCurrent: 'Stop the current turn before branching this chat.',
    branchNoText: 'This message has no text to branch from.',
    branchTitle: n => `Draft: Branch #${n}`,
    branchFailed: 'Branch failed',
    deleteFailed: 'Delete failed',
    archived: 'Archived',
    archiveFailed: 'Archive failed',
    restored: 'Restored',
    unarchiveFailed: 'Unarchive failed',
    cwdChangeFailed: 'Working directory change failed',
    cwdStagedTitle: 'Working directory staged',
    cwdStagedMessage: 'Restart the desktop backend to apply cwd changes to this active session.',
    modelSwitchConfirmBody: 'This model switch needs confirmation.',
    modelSwitchConfirmLabel: 'Switch anyway',
    modelSwitchConfirmTitle: (model: string) => `Switch to ${model}?`,
    modelSwitchConfirmTitleFallback: 'Switch models?',
    modelSwitchFailed: 'Model switch failed',
    modelSwitchKeepLabel: 'Keep current model',
    modelSwitchStaleNotice: 'Selection changed — the model switch was not applied.',
    hydrationSyncing: (profile: string) => `Syncing ${profile}\u2026`,
    sessionExported: 'Session exported',
    sessionExportFailed: 'Could not export session',
    imageSaved: 'Image saved',
    downloadStarted: 'Download started',
    restartToUseSaveImage: 'Restart Hermes Desktop to use Save Image.',
    restartToSaveImages: 'Restart Hermes Desktop to save images',
    imageDownloadFailed: 'Image download failed',
    openImage: 'Open image',
    downloadImage: 'Download image',
    savingImage: 'Saving image',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoom: 'Reset zoom',
    imagePreviewFailed: 'Image preview failed',
    imageAttach: 'Image attach',
    imageWriteFailed: 'Failed to write image to disk.',
    imageAttachFailed: 'Image attach failed',
    pastedContent: 'Pasted content',
    pasteAttachFailed: 'Could not attach pasted text',
    attachImages: 'Attach images',
    clipboard: 'Clipboard',
    noClipboardImage: 'No image found in clipboard',
    clipboardPasteFailed: 'Clipboard paste failed',
    dropFiles: 'Drop files',
    handoff: {
      pickPlatform: 'Choose a destination',
      success: platform => `Handed off to ${platform}. Resume here anytime.`,
      systemNote: platform => `↻ Handed off to ${platform} — resume here anytime.`,
      failed: error => `Handoff failed: ${error}`,
      timedOut:
        "Hermes couldn't reach your messaging connection. Start it from Settings → Messaging, then try the handoff again.",
      startMessaging: 'Start messaging'
    }
  },

  tips: {
    close: "Don't show this tip again",
    items: {
      'new-session': {
        title: 'Start fresh',
        text: 'A new chat gets its own context, terminal and working directory.'
      },
      skills: {
        title: 'Teach it once',
        text: 'Skills are folders of instructions Hermes loads when the work calls for them.'
      },
      messaging: {
        title: 'Hermes away from your desk',
        text: 'Connect Telegram, Discord, Slack and more — same agent, same memory.'
      },
      artifacts: {
        title: 'Everything Hermes made',
        text: 'Images, files and links from every session, indexed in one place.'
      },
      cron: {
        title: 'Work that runs itself',
        text: 'Schedule a prompt hourly, nightly, or on a cron expression.'
      },
      'command-palette': {
        title: 'One box for everything',
        text: 'Sessions, settings, skills and commands all answer to the palette.'
      },
      profiles: {
        title: 'Profiles are separate',
        text: 'Each one is its own Hermes — own keys, own memory, own sessions.'
      },
      'composer-mentions': {
        title: 'Attach and command',
        text: 'Type @ to bring a file into the conversation, / to run a command.'
      },
      'local-runtime-update': {
        title: 'A local engine update is available',
        text: 'Update the engine that runs your local models. Active local requests may be interrupted.',
        action: 'Update now'
      },
      'local-setup': {
        title: 'This machine can run models locally',
        text: 'Your hardware can serve a local model. Chats stay on your computer and cost nothing.',
        action: 'Set it up'
      },
      'right-pane': {
        title: 'The working pane',
        text: 'Files, terminal, review and the in-app browser share the right side.'
      }
    }
  },

  errors: {
    genericFailure: 'Something went wrong',
    boundaryTitle: 'Something broke in the interface',
    boundaryDesc: 'The view hit an unexpected error. Your chats and settings are safe.',
    boundaryDetails: 'Details',
    sendDiagnostics: 'Send diagnostics',
    reloadWindow: 'Reload window',
    openLogs: 'Open logs'
  },

  ui: {
    search: {
      clear: 'Clear search'
    },
    logs: {
      bottom: 'Bottom of log',
      search: 'Search logs…',
      top: 'Top of log'
    },
    pagination: {
      label: 'pagination',
      previous: 'Prev',
      previousAria: 'Go to previous page',
      next: 'Next',
      nextAria: 'Go to next page'
    },
    sidebar: {
      title: 'Sidebar',
      description: 'Displays the mobile sidebar.',
      toggle: open => `${open ? 'Show' : 'Hide'} sidebar`
    }
  }
}
