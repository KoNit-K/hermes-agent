Warning: truncated output (original token count: 187947)
Total output lines: 19831

import { type ChildProcess, execFileSync, spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import os from 'node:os'
import path from 'node:path'
import tls from 'node:tls'
import { pathToFileURL } from 'node:url'

import {
  app,
  BrowserWindow,
  clipboard,
  crashReporter,
  dialog,
  net as electronNet,
  webContents as electronWebContents,
  globalShortcut,
  ipcMain,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
  Menu,
  type MenuItemConstructorOptions,
  nativeTheme,
  powerMonitor,
  powerSaveBlocker,
  protocol,
  safeStorage,
  screen,
  session,
  shell,
  systemPreferences
} from 'electron'
import type { Session } from 'electron'

import { type ActiveRuntimeState, classifyActiveRuntime } from './active-runtime-state'
import {
  destroyKeepaliveAgents,
  htmlResponseError,
  httpStatusError,
  jsonAgentFor,
  readJsonErrorBody,
  readStatusCode,
  withRetry
} from './api-transport'
import { appIconCandidates, resolveAppIcon, shouldOverrideDockIcon } from './app-icon'
import { stageAppInstallerFile } from './app-installer-file'
import {
  appVersionInfo,
  type AppVersionInfo,
  assertSourceUpdateChannel,
  nativeAboutVersion,
  packagedReleaseChannel
} from './app-version'
import { runAppInstallerChecker } from './appinstaller-checker'
import { installApplicationMenuAfterFirstWindow } from './application-menu-startup'
import { stopBackendChild as stopBackendChildImpl, waitForBackendExit } from './backend-child'
import {
  type BackendOutputTail,
  claimDecision,
  createBackendOutputTail,
  execText,
  formatBackendExitLine,
  isPidOnlyStartMarker,
  pidOnlyStartMarker,
  probeStartMarker,
  processStartMarker,
  REAP_PROBE_TIMEOUT_MS
} from './backend-claim'
import { dashboardFallbackArgs, serveBackendArgs } from './backend-command'
import { createBackendConnectionState } from './backend-connection-state'
import { BackendDialClaims } from './backend-dial-claim'
import type { HostBackendRecord } from './backend-discovery'
import { buildDesktopBackendEnv, profileBackendParentEnv } from './backend-env'
import { createBackendExitRecoveryLatch } from './backend-exit-recovery'
import { isReauthRequiredError, waitForHermesReady } from './backend-health'
import {
  backendCommandMatches,
  type BackendOwnershipEntry,
  createBackendOwnership,
  createBackendShutdownCoordinator
} from './backend-ownership'
import { canImportHermesCli, PROBE_TIMEOUT_MS, shouldTrustHermesOverride, verifyHermesCli } from './backend-probes'
import { waitForDashboardPortAnnouncement } from './backend-ready'
import { recycleOwnedBackend } from './backend-recycle'
import { isPidAliveWindows, waitForBackendRelease } from './backend-release-gate'
import { createInstalledRuntimeGate } from './backend-resolution'
import { createBackendServeSupportResolver } from './backend-serve-support'
import {
  isHostKeyChangedBootFailure,
  isRetryableRemoteBootFailure,
  isSshAuthFailedBootFailure,
  isSshClientFailedBootFailure,
  shouldHoldBootProgressForReauth,
  shouldLatchBackendStartFailure,
  shouldLatchHostKeyChangedFailure,
  shouldLatchRemoteReauthFailure,
  shouldLatchSshAuthFailure,
  shouldLatchSshClientFailure,
  sshClientFailedError
} from './backend-start-failure'
import { describeBootstrapFailure } from './bootstrap-failure-copy'
import {
  detectRemoteDisplay,
  isWindowsBinaryPathInWsl,
  isWslEnvironment,
  resolveLinuxPasswordStore
} from './bootstrap-platform'
import { decideBootstrapRepair } from './bootstrap-repair-guard'
import { runBootstrap } from './bootstrap-runner'
import { bootstrapSnapshot } from './bootstrap-state'
import {
  BROWSER_WINDOW_HEIGHT,
  BROWSER_WINDOW_MIN_HEIGHT,
  BROWSER_WINDOW_MIN_WIDTH,
  BROWSER_WINDOW_WIDTH,
  buildBrowserWindowUrl
} from './browser-windows'
import { createBundleSkewChecker } from './bundle-skew'
import { detectBundleSwap, readBundleSwapStamp } from './bundle-swap'
import { registerChatOnboardingWindow } from './chat-onboarding-window'
import { provisionCliLinks } from './cli-provision'
import { closeStopFailureMessage, finishWindowsCloseStop, type RuntimeLock } from './close-stop-kill'
import { shouldAttemptCloudBootCascade } from './cloud-boot-cascade'
import { discoverWithTeamFallback } from './cloud-discovery'
import { createCloudSessionRecovery } from './cloud-session-recovery'
import { installCommandScreenshot } from './command-screenshot'
import { composerImageTimestamp } from './composer-image-name'
import { writeComposerPaste } from './composer-paste'
import { applyConnectionChange, teardownSshState } from './connection-apply'
import {
  connectionInstallIds,
  evictConnectionCaches,
  rosterSourceErrors,
  sshInventoryAttemptedAt,
  sshRosterCache
} from './connection-caches'
import {
  apiRequestRegistryConnectionId,
  authModeFromStatus,
  buildGatewayWsUrl,
  buildGatewayWsUrlWithTicket,
  connectionScopeKey,
  cookiesHaveLiveSession,
  cookiesHaveSession,
  gatewayWsUrlIpcResult,
  hostLabelFromBaseUrl,
  isGatewayAuthRejection,
  localProfileEntry,
  modeIsRemoteLike,
  normalizeRemoteBaseUrl,
  normalizeRemoteHeaders,
  normalizeRemoteProfileName,
  normalizeSshConfig,
  normAuthMode,
  pathForRegistryBackendRequest,
  pathWithGlobalRemoteProfile,
  profileHasRemoteConnection,
  profileRemoteOverride,
  type ProfileRouteOptions,
  profileSshOverride,
  type RegistryBackendRequestScope,
  resolveAuthMode,
  resolveProfileApiRequest,
  resolveProfileBackendRoute,
  resolveRemoteSshDashboardProfile,
  resolveTestWsUrl,
  sanitizeRemoteHeaderValue,
  savedProfileSsh,
  tokenPreview,
  unscopableMutatingRequest,
  withTransientRetries
} from './connection-config'
import { applyConnectionConfigAtomically } from './connection-config-apply'
import {
  backendScopeKey,
  backendScopePrefix,
  buildAgentRoster,
  connectionDialFieldsChanged,
  connectionIdForPendingLogin,
  mergeConnectionInput,
  migrateV1ToRegistry,
  normalizeConnectionInput,
  normalizeRegistry,
  parseBackendScopeKey,
  reconcileAppliedGlobalConnection,
  reconcileRegistryDrift,
  registryDialConnectionId,
  rememberSshEnumeration,
  removeConnection,
  type ResolvedConnectionDescriptor,
  resolvedConnectionId,
  resolveRegistryLocalRoute,
  reuseMatchingPrimaryRemoteBackend,
  reuseMatchingPrimarySshBackend,
  setConnectionLaunchMode,
  setLastUsedConnection,
  setPrimaryConnection,
  type SharedRegistryProfileScope,
  shouldDeferLocalEnumeration,
  shouldRetrySshInventory,
  updateEligibility,
  upsertConnection
} from './connection-registry'
import type { RegistryConnection } from './connection-registry'
import type { RosterProfileMetadata } from './connection-registry'
import { liveWindowState, overlayWindowState } from './connection-window-state'
import { describeCrashReason, installCrashForensics } from './crash-forensics'
import {
  adoptServedDashboardToken,
  isAttachedBackendTokenDrifted,
  resolveServedDashboardToken
} from './dashboard-token'
import { resolveDashboardWebDist } from './dashboard-web-dist'
import { resolveDesktopHermesHome, resolveDesktopUserData } from './data-paths'
import { loadOrCreateInstallationId, sshOwnershipId } from './desktop-installation'
import { formatDesktopLogLine, formatLogStamp } from './desktop-log-line'
import {
  createDesktopProfilePreferences,
  DESKTOP_PROFILE_NAME_RE,
  type DesktopProfileRoute,
  resolveDesktopConnectionRequest,
  resolveDesktopWindowLaunch
} from './desktop-profile'
import { registryPrimaryBootRoute, resolveDesktopRemoteRoute, v1SshTerminalPoolKey } from './desktop-remote-route'
import { type DesktopSharedMetrics, registerDesktopSharedMetrics } from './desktop-shared-metrics'
import {
  buildPosixCleanupScript,
  buildWindowsCleanupScript,
  type DesktopUninstallResult,
  modeRemovesAgent,
  modeRemovesUserData,
  registerDesktopUninstallIpc,
  resolveRemovableAppPath,
  shouldRemoveAppBundle,
  uninstallArgsForMode,
  type UninstallSummaryDetails
} from './desktop-uninstall'
import { describeDevCdpDecision, resolveDevCdpPort } from './dev-cdp'
import { preReadyDockLaunchSteps } from './dock-launch-order'
import { installEmbedReferer } from './embed-referer'
import { createAmbientClaimArbiter } from './event-dedupe'
import { openExternalUrl as externalOpen, type ExternalOpenDeps, reportPreOpenStatFailure } from './external-open'
import {
  buildTerminalScript,
  resolveTerminalLaunch,
  terminalScriptEnv,
  terminalScriptExtension,
  tuiResumeArgs
} from './external-terminal'
import { f12ShortcutDecision, toF12KeyboardEventPayload } from './f12-shortcut'
import { resolveFeatureFlags } from './feature-flags'
import {
  installFindShortcut,
  installFoundInPageForwarder,
  performFindAfterIndexingStarted,
  stopFind
} from './find-in-page'
import { createFirstRunSetupGate } from './first-run-setup-gate'
import { registerFsIpc } from './fs-ipc'
import type {
  GatewayFileSaveContext,
  GatewayFileSaveDeps,
  GatewayFileSaveResult,
  GatewaySaveDialogOptions,
  GatewaySaveDialogResult
} from './gateway-file-download'
import {
  gatewayFilePath,
  gatewayFileRequestPaths,
  resolveGatewayFileBackend,
  saveGatewayDownload
} from './gateway-file-download'
import { downloadViaOauthSessionToFile, downloadViaTokenToFile } from './gateway-file-download-transport'
import { stopGatewayBeforeUpdate } from './gateway-stop-before-update'
import { resolveGatewayVersion } from './gateway-version'
import { probeGatewayWebSocket, spawnedBackendProbeOptions } from './gateway-ws-probe'
import { windowsGitCandidates } from './git-binary-candidates'
import { registerGitIpc } from './git-ipc'
import { desktopBackendSpawnEnv, guestOnboardingEnabled } from './guest-onboarding'
import { readAndConsumeHandoffResult } from './handoff-result'
import {
  assertExistingPathForOpen,
  ATTACHMENT_UPLOAD_DEFAULT_MAX_BYTES,
  clampDataUrlReadMaxMb,
  DATA_URL_READ_DEFAULT_MAX_MB,
  dataUrlReadMaxBytesFromMb,
  DEFAULT_FETCH_TIMEOUT_MS,
  enableBasicPasswordStoreEncryption,
  encryptDesktopSecret as encryptDesktopSecretStrict,
  homeRelativeAttachmentCandidates,
  isMissingFileError,
  missingFileResult,
  readFileDataUrlForIpc,
  resolvePersistedRemoteToken,
  resolveReadableFileForIpc,
  resolveRemoteTokenPlainText,
  resolveRequestedPathForIpc,
  resolveTimeoutMs,
  SAFE_STORAGE_ENCODING,
  TEXT_PREVIEW_SOURCE_MAX_BYTES,
  tightenSecretFileMode,
  writeSecretFileAtomic
} from './hardening'
import {
  type AttachedBackend,
  attachOrReserveSpawn,
  HOST_SPAWN_GATE_STALE_MS,
  spawnLedgerPath,
  type SpawnReservation
} from './host-backend-attach'
import { assertNoSecondLocalBackend, assertNotPassiveSpawn } from './host-backend-singleton'
import { lookupPublishedSessionToken } from './host-published-token'
import { claimHostSpawnGate } from './host-spawn-gate'
import { HERMES_HUB_FALLBACK_ORIGIN, HERMES_HUB_ORIGIN, isHermesHubClipboardWrite } from './hub-iframe-policy'
import { requestHudClose } from './hud-close'
import { cursorPointInWindow } from './hud-cursor'
import { startHudGameOverlayWatch } from './hud-game-overlay'
import { applyHudResetBounds, defaultHudBounds } from './hud-geometry'
import { registerHudIpc } from './hud-ipc'
import { installHudModifierTap } from './hud-modifier'
import { applyHudElectronOverlay, promoteHudOverlay } from './hud-overlay'
import { snapHudBounds } from './hud-snap'
import { createHudSnapShortcut } from './hud-snap-shortcut'
import { buildHudWindowUrl } from './hud-url'
import { linuxOzoneBackend, resolveHudWindowing } from './hud-windowing'
import { INSTALL_STAMP, installShape } from './install-stamp'
import type { InstallStamp } from './install-stamp'
import { applyLaunchProfileOverride } from './launch-profile'
import { fetchLinkTitle, resolveFaviconCached } from './link-metadata'
import { CHROMIUM_LOG_FILENAME, enableLinuxCrashDiagnostics, linuxCrashDiagnostics } from './linux-crash-diagnostics'
import {
  decideLinuxGpuLaunch,
  disableGpuSwitchNeededForReason,
  LINUX_GPU_SILENT_RETRY_GRACE_S,
  linuxGpuChildDeathPath,
  linuxGpuFallbackMarker,
  linuxGpuMarkerAfterSuccessfulBoot,
  readLinuxGpuMarker,
  shouldEngageSilentGpuRetryFallback,
  writeLinuxGpuMarker
} from './linux-gpu-fallback'
import { notifyLauncherWindowRevealed } from './linux-launcher-ready'
import {
  decideNvidiaEglFallback,
  nvidiaEglFallbackMarker,
  nvidiaEglMarkerAfterSuccessfulBoot,
  parseNvidiaDriverMajor,
  parseNvidiaDriverVersion,
  readNvidiaEglMarker,
  shouldRelaunchForNvidiaGpuDeath,
  writeNvidiaEglMarker
} from './linux-nvidia-egl-fallback'
import { createLocalBackendLifecycle, waitForTeardown } from './local-backend-lifecycle'
import { resolveIpcFileReadPath, resolveMediaStreamFile, resolvePreviewTargetPath } from './local-read-path'
import { localSkinProfileKey, readLocalSkinPayload } from './local-skin'
import { ACTIVE_LOG_POLL_MS, planLogRotation, reclaimActiveLogIfOversized } from './log-rotation'
import { registerMachineProfile } from './machine-profile'
import { createMainProcessLagWatchdog } from './main-process-lag-watchdog'
import { ensureMainWindow } from './main-window-lifecycle'
import {
  assertManagedUpdatePreflightClear,
  executeManagedRemoteUpdate,
  fenceManagedSshBootstrapPublication,
  ManagedConnectionUpdateGate,
  managedSshDrainBlocker,
  managedSshRecoveryScopes,
  managedSshScopeRole,
  managedSshTokenPersistencePlan,
  managedSshUpdateAllRow,
  MAX_MANAGED_SSH_RECOVERY_ATTEMPTS,
  recoverManagedSshScopes,
  refusedManagedSshUpdate,
  type RemoteUpdateTarget,
  runManagedSshUpdate,
  validateCorrelationId,
  waitForManagedRemoteClearance,
  waitForManagedSshBootstrapFence,
  waitForManagedUpdateOperations
} from './managed-ssh-update'
import { registerMcpOauthCallbackIpc } from './mcp-oauth-callback-ipc'
import { isMediaCapturePermission } from './media-capture-permission'
import { createMediaProtocolHandler, MEDIA_PROTOCOL } from './media-protocol'
import { fetchLocalMedia } from './media-range'
import { createMinimizeToTray } from './minimize-to-tray'
import {
  createNativeAccessTokenCoordinator,
  type NativeAccessTokenOptions,
  NativeAuthChangedError
} from './native-access-token'
import { oauthSessionIsLive, resolveJsonBody, resolveReadinessProbeAuth } from './native-auth-decisions'
import {
  nativeRefreshUrl,
  type NativeTokenSet,
  parseTokenResponse,
  resolveLoginStrategy,
  tokenNeedsRefresh
} from './native-oauth'
import { runNativeLogin } from './native-oauth-login'
import { loadNativeTokenSet, type NativeTokenStoreIo, persistNativeTokenSet } from './native-token-store'
import { execGit, killTimedGitChildren, setNoConsoleGitRoots } from './no-console-git'
import { registerNativeNotifications } from './notification-ipc'
import { isExpectedOauthNavigationAbort } from './oauth-navigation'
import { serializeJsonBody, setJsonRequestHeaders } from './oauth-net-request'
import { LEGACY_OAUTH_PARTITION, resolveOauthPartition } from './oauth-partition'
import {
  canShowInteractiveOauthLogin,
  mintGatewayWsTicket as mintOauthGatewayWsTicket,
  requestWithOauthFallback,
  retryCookie401WithLogin,
  withoutInteractiveOauthLogin
} from './oauth-rest-request'
import { wireOauthSessionResponse } from './oauth-session-response'
import { listWindowsProcesses, reapPackageRootedProcesses } from './package-process-reap'
import { createParentStartMarkerResolver, parentWatchdogEnv } from './parent-process-identity'
import { bundledPayload, installIdForRoot, type PayloadInfo } from './payload-backend'
import { petOverlayClickThrough, shouldPopInOnOverlayClosed } from './pet-overlay'
import { placePetOverlay, registerPetOverlayIpc } from './pet-overlay-ipc'
import {
  buildRegistryProfileRoutes,
  isLocalEnumerationFailure,
  localRouteFallbackProfiles,
  undialedSshRouteSeeds
} from './plugin-profile-routes'
import { clampPoolLimits, parsePoolLimits, POOL_LIMITS_DEFAULTS, POOL_LIMITS_MIN } from './pool-limits'
import { createPoolRetirer } from './pool-retire'
import { createPoolRetirementClient } from './pool-retire-http'
import {
  assertPoolEntryStillOwned,
  BackgroundSlotRetryBackoff,
  BackgroundSlotRetryDeferredError,
  isBackgroundSlotRetryDeferred,
  isBackgroundSlotWaitTimeout,
  LocalBackendSpawnCoordinator,
  type LocalBackendSpawnPriority,
  registerLocalBackendExitFinalizer,
  releaseLocalBackendSlot,
  releaseLocalBackendSlotAfterExit
} from './pool-spawn-coordinator'
import { createPoolStopper } from './pool-stop'
import { poolTouchKeys } from './pool-touch-scope'
import { createPortalSession } from './portal-session'
import { createKeepAwake } from './power-save'
import { readPreUpdateBackupEnabled } from './pre-update-backup-config'
import { capturePreviewContents } from './preview-capture'
import { onPreviewWatchOwnerDestroyed, sendPreviewFileChangedToOwner } from './preview-file-watch'
import { hasClosePreviewFlag, previewGuestInputAction } from './preview-guest-escape'
import { PreviewReachRegistry } from './preview-reach'
import {
  createPrimaryRemoteConnection,
  FirstRunSetupResetError,
  runPrimaryBackendStartup
} from './primary-backend-startup'
import { rehomePrimaryConnection } from './primary-connection-rehome'
import { PrimaryProfilePin, resolveLaunchProfile } from './primary-profile-pin'
import { applyDesktopIdentity, PRODUCT_IDENTITY } from './product-identity'
import {
  assertLocalProfileCanStart,
  decideProfileDeleteAction,
  dispatchConnectionScopedProfileDelete,
  localProfilePoolKeys,
  ProfileDeletionGate,
  profileNameFromDeleteRequest,
  resolveRouteProfile
} from './profile-delete-routing'
import { migrateActiveProfileIfMissing as migrateActiveProfileIfMissingPure } from './profile-migration'
import { prepareProfileRenameLifecycle, profileRenameFromRequest } from './profile-rename-routing'
import {
  assembleSidebarSessionSlices,
  buildSidebarSessionSliceParams,
  fetchPrimaryProfileSessions,
  fetchRegistrySessionRows,
  fetchRemoteProfileSessions,
  findRemoteOwnerProfileForSession,
  hasPinnedRegistrySessionSource,
  isAllProfilesSessionListRequest,
  mergeProfileSessionWindow,
  pathWithRemoteOwnerScope,
  type RegistrySessionSource,
  remoteProfileQueryScope,
  shouldIncludeLocalRegistrySessionSource,
  spliceRegistrySessionRows,
  tagRegistrySessionResponse,
  tagRemoteSessionRows
} from './profile-session-routing'
import {
  createQuickEntryShortcut,
  createQuickEntrySubmitRelay,
  quickEntryWindowBounds,
  sanitizeQuickEntrySettings
} from './quick-entry'
import { createQuitFinalization } from './quit-finalization'
import {
  type ActiveWork,
  backendOwnedByApp,
  mergeActiveWork,
  normalizeActiveWork,
  quitPromptFor,
  shouldGuardWindowClose
} from './quit-guard'
import {
  backendQuitNeedsWait,
  backendTeardownOptions,
  createQuitTeardownCoordinator,
  type QuitTeardownTask
} from './quit-teardown'
import * as remoteLifecycle from './remote-lifecycle'
import {
  attachPowerResumeRemoteRevalidation,
  ensureHealthyPooledRemoteBackendForDispatch,
  REMOTE_POOLED_LIVENESS_FAILURE_WINDOW_MS,
  RemoteLivenessTracker,
  RemoteRevalidationCoordinator,
  revalidatePooledRemoteBackends,
  revalidateRemoteConnection,
  revalidateSuspectPooledRemoteBackends
} from './remote-liveness'
import { resolveRemoteOauthTicket, rosterSourceEnumerationTimeoutMs } from './remote-oauth-ticket'
import { createRemoteOwnerCache } from './remote-owner-cache'
import { remoteSessionCookies } from './remote-session-cookies'
import {
  attachRemoteRequestHeaderListener,
  collectRemoteHeaderSources,
  createRegistryGatewayWsUrlHandler,
  createRemoteWsHeaderStore,
  oauthLoginLoadUrlOptions,
  resolveRemoteRequestHeaders
} from './remote-ws-headers'
import { enableRendererAccessibility } from './renderer-accessibility'
import { missingRendererAssets, presentRendererIndexes } from './renderer-bundle'
import { planLaunchSwitches, readDesktopLaunchConfig } from './renderer-heap-flags'
import { loadRendererLoadErrorPage } from './renderer-load-error-page'
import { attachRendererConsoleCapture, formatRendererBoundaryReport } from './renderer-log'
import { startRendererServer } from './renderer-server'
import { isRendererUrl } from './renderer-url'
import { fetchRosterSourceData } from './roster-source-fetch'
import { rosterSourceStatus } from './roster-source-status'
import {
  classifyStoredSecret,
  readSecretStoragePolicy,
  SECRET_STORAGE_POLICY_FILE,
  type SecretStoragePolicy,
  writeSecretStoragePolicy
} from './secret-storage-policy'
import { selectPathsDialogProperties } from './select-paths-dialog'
import { selectRunnableBinary } from './select-runnable-binary'
import {
  buildInstanceWindowUrl,
  buildSessionWindowUrl,
  chatWindowWebPreferences,
  createSessionWindowRegistry,
  instanceWindowBounds,
  SESSION_WINDOW_MIN_HEIGHT,
  SESSION_WINDOW_MIN_WIDTH
} from './session-windows'
import { ensureLoginShellPath } from './shell-path'
import { removeStaleSingletonLock } from './singleton-lock'
import { createSourcePythonBackend, resolveSourceInstallationBackend, type SourceBackend } from './source-backend'
import { resolveSourcePython } from './source-python'
import { resolveSshBinary } from './ssh-binary'
import { createBootstrapCoordinator, sshConfigFingerprint } from './ssh-bootstrap-coordinator'
import { collectSshConfigHosts, parseSshGOutput } from './ssh-config'
import { createSshProbeConnection, pickLocalPort, redactSecrets, SshConnection } from './ssh-connection'
import { createSshIsolatedKeepaliveRegistry } from './ssh-isolated-keepalive'
import { createSshTeardownTracker } from './ssh-teardown'
import { createStreamThrottle } from './stream-throttle'
import { installSystemCaTrust } from './system-ca'
import { registerTerminalIpc } from './terminal-ipc'
import { nativeOverlayWidth as computeNativeOverlayWidth, titleBarOverlayOptions } from './titlebar-overlay-width'
import {
  backgroundMaterialFor,
  defaultTranslucencyState,
  glassActive,
  glassSupportedOn,
  installTranslucencyReassertOnDisplayMetrics,
  installTranslucencyReassertOnWindowEvents,
  normalizeState as normalizeTranslucency,
  opacityNeedsSetting,
  translucencyReassertForDpiChange,
  translucencySupportedOn,
  vibrancyFor as vibrancyForTranslucency,
  windowBackgroundMaterialOptions,
  windowBackingOptions,
  windowOpacityFor,
  windowOpacityOptions
} from './translucency'
import { updateGateReason, waitForUpdateClearance } from './update-gate'
import { readLiveUpdateMarker, updateHandoffConflict, writeUpdateMarker } from './update-marker'
import { updateConnectionsBeforeLocal } from './update-order'
import {
  resolveUpdaterMechanism,
  type UpdaterApplyResultWire,
  type UpdaterStatusWire,
  type UpdaterStrategy
} from './updater'
import {
  observeUpdaterHandoff,
  resolveInstallationLauncher,
  resolveStagedUpdaterBinary,
  resolveVenvDir,
  spawnUpdaterProcess,
  stagedUpdaterSupportsPrewrittenMarker,
  userLauncherInstallRoot
} from './updater-process'
import { AppInstallerStrategy } from './updater/app-installer'
import { createChannelAppInstallerStrategy } from './updater/app-installer'
import { ChannelResolver, type ChannelTarget } from './updater/channel'
import { inspectRunningChannelApp } from './updater/channel-native'
import { ChannelStrategy } from './updater/channel-strategy'
import { verifyPreparedChannelInstaller } from './updater/channel-windows-host'
import { createCheckoutStrategy } from './updater/checkout'
import { readSourceUpdate, type SourceUpdate } from './updater/checkout-source'
import { ExternalStrategy } from './updater/external'
import { readUpdatesFeedBaseFromConfig, resolveFeedBaseUrl } from './updater/feed-config'
import { createChannelMacStrategy, createMacStrategy } from './updater/mac-client'
import { UpdateOperation } from './updater/operation'
import {
  type ConsumedRelaunch,
  consumePendingRelaunch,
  registerUpdateRelaunch,
  type RelaunchRegistration
} from './updater/relaunch'
import { startRelaunchWaiter } from './updater/relaunch-waiter'
import { preflightStateDb } from './updater/state-db-preflight'
import { createStoreStrategy } from './updater/store-client'
import { isExternalVenvHolder, isHermesOwnedVenvDaemon } from './venv-holder-select'
import { fetchMarketplaceThemes, searchMarketplaceThemes } from './vscode-marketplace'
import { createWakeIndicatorWindowController } from './wake-indicator-window'
import { windowAcceleratorAction } from './window-accelerator'
import { enumerateWindowsFrontToBack, enumerationFailed, readWindowBelow } from './window-below'
import { bindWindowChromeEvents } from './window-chrome-events'
import {
  appliedPrimaryWindowRoute,
  registrySshPoolScopeByConnectionId,
  registrySshScopeForWindowRoute,
  WindowConnectionRouteRegistry
} from './window-connection-route'
import { registerWindowControlIpc, windowControlState } from './window-controls'
import { revealAction, shouldFocusToTakeKeyboard } from './window-focus-policy'
import { windowMenuTemplate } from './window-menu'
import { createWindowOpenHandler } from './window-open-policy'
import { installWindowRendererLifecycle } from './window-renderer-lifecycle'
import { wireWindowReveal } from './window-reveal'
import {
  bindGeometryPersistence,
  computeWindowOptions,
  debounce,
  firstLaunchSize,
  sanitizeWindowState,
  MIN_HEIGHT as WINDOW_MIN_HEIGHT,
  MIN_WIDTH as WINDOW_MIN_WIDTH
} from './window-state'
import { hiddenWindowsChildOptions, windowsShellCommand } from './windows-child-options'
import { buildPathExtCandidates, chooseUpdaterArgs, resolveVenvHermesCommand } from './windows-hermes-path'
import {
  connectWindowsRemote,
  detectRemotePlatform,
  helper,
  probeWindowsRemote,
  terminateOwnedWindowsDashboardForUpdate
} from './windows-remote-lifecycle'
import {
  alreadyHasNoSandbox,
  buildNoSandboxRelaunchArgs,
  decideWindowsSandboxLaunch,
  fallbackMarker,
  grantAllApplicationPackagesAcl,
  markerAfterSuccessfulBoot,
  readSandboxMarker,
  type SandboxFallbackReason,
  shouldAttemptAclRepair,
  shouldRelaunchForGpuSandboxCrash,
  shouldRelaunchForRendererSandboxCrashLoop,
  writeSandboxMarker
} from './windows-sandbox-fallback'
import {
  alreadyHasDisableGpu,
  buildDisableGpuRelaunchArgs,
  decideWindowsGpuStackCookieLaunch,
  gpuStackCookieFallbackMarker,
  isHermesDesktopGpuOverrideOff,
  markerAfterSuccessfulGpuStackCookieBoot,
  readGpuStackCookieMarker,
  shouldRelaunchForRendererStackCookieCrashLoop,
  shouldSurfaceErrorForRendererStackCookieCrashLoop,
  writeGpuStackCookieMarker
} from './windows-stack-cookie-fallback'
import { readWindowsUserEnvVar } from './windows-user-env'
import { isPackagedInstallPath as isPackagedInstallPathUnderRoots } from './workspace-cwd'
import { readWslWindowsClipboardImage } from './wsl-clipboard-image'
import { resolvePickerDefaultPath, setActiveGatewayProfile, setWslBridgeProfileState } from './wsl-path-bridge'

const IDENTITY_APP_NAME: string | null = applyDesktopIdentity(app)
const USER_DATA_OVERRIDE: string | undefined = process.env.HERMES_DESKTOP_USER_DATA_DIR

if (USER_DATA_OVERRIDE || process.env.HERMES_DATA_DIR_SUFFIX) {
  const resolvedUserData: string = resolveDesktopUserData(app.getPath('userData'))
  fs.mkdirSync(resolvedUserData, { recursive: true })
  app.setPath('userData', resolvedUserData)
}

const DEV_SERVER = process.env.HERMES_DESKTOP_DEV_SERVER
const IS_PACKAGED = app.isPackaged || Boolean(process.env.HERMES_DESKTOP_IS_PACKAGED)
let packagedRendererServer: Awaited<ReturnType<typeof startRendererServer>> | null = null
const IS_MAC = process.platform === 'darwin'
const IS_WINDOWS = process.platform === 'win32'
const IS_WSL = isWslEnvironment()
// Truthful macOS kernel major (Tahoe = 25). Product version lies (16 vs 26) per
// build SDK, so gate Tahoe workarounds on Darwin instead.
const DARWIN_MAJOR = IS_MAC ? Number.parseInt(os.release(), 10) || 0 : 0
// Glass: macOS vibrancy, or Windows 11 22H2+ system backdrop. Computed once
// so the renderer, the persisted default, and every chat window agree.
const GLASS_SUPPORTED = glassSupportedOn(process.platform, os.release())
// Clear rides setOpacity, a documented no-op on Linux, so neither mode works
// there and Settings drops the row entirely.
const TRANSLUCENCY_SUPPORTED = translucencySupportedOn(process.platform)
const APP_ROOT = app.getAppPath()

// Device-local preference: block F12 from opening DevTools.
// Set dynamically via IPC from the renderer Settings → Advanced.
let f12Blocked = false

// Preload must be plain JS — Electron's sandbox can't run .ts, and tsx's
// ESM loader is broken on Electron 40's Node (ERR_INVALID_RETURN_PROPERTY_VALUE).
// Dev (`npm run dev`) and prod both load the esbuild output from dist/.
const PRELOAD_PATH = path.join(APP_ROOT, 'dist', 'electron-preload.js')
const PREVIEW_GUEST_PRELOAD_PATH = path.join(APP_ROOT, 'dist', 'preview-guest-preload.js')

// Remote displays (SSH X11 forwarding, VNC, RDP) make Chromium's GPU
// compositor flicker — accelerated layers can't be presented cleanly over the
// wire, so the window flashes during scroll/streaming/animation. Local
// Windows/macOS (and WSLg, which renders locally via vGPU) composite on the
// GPU and never see it. Fall back to software rendering when a remote display
// is detected; it's rock-steady over the wire and the CPU cost is negligible
// next to the connection's latency. Must run before app `ready` — these
// switches only apply pre-launch. Override with HERMES_DESKTOP_DISABLE_GPU
// (1/true → always disable, 0/false → keep GPU on).
const REMOTE_DISPLAY_REASON = detectRemoteDisplay()

if (REMOTE_DISPLAY_REASON) {
  app.disableHardwareAcceleration()
  // Belt-and-suspenders for X11/VNC, where the Viz compositor can still glitch
  // with only --disable-gpu: force compositing onto the CPU too.
  app.commandLine.appendSwitch('disable-gpu-compositing')

  // #97616: disableHardwareAcceleration() alone does NOT stop a GPU child
  // from spawning (it then dies error_code=1002 on AMD/Mesa). For the explicit
  // HERMES_DESKTOP_DISABLE_GPU override, fully spawn-block it. Remote-display
  // detections keep their long-standing compositing-only behavior.
  if (disableGpuSwitchNeededForReason(REMOTE_DISPLAY_REASON)) {
    app.commandLine.appendSwitch('disable-gpu')
  }

  console.log(
    `[hermes] remote display detected (${REMOTE_DISPLAY_REASON}); disabling GPU hardware acceleration to prevent flicker`
  )
}

// #108047: a local Windows renderer crash loop with STATUS_STACK_BUFFER_OVERRUN
// (0xC0000409) is recovered by disabling GPU — NOT by dropping the sandbox
// (that path stays owned by STATUS_BREAKPOINT / #38216). Must run before app
// `ready`. Skip applying switches when the remote-display block above already
// did; still honor a sticky per-version marker so Start Menu launches recover.
let windowsGpuStackCookieFallbackActive = false
let windowsGpuStackCookieFallbackSticky = false
let windowsGpuStackCookieRelaunchAttempted = false

if (IS_WINDOWS) {
  const windowsGpuUserData = app.getPath('userData')

  const gpuStackCookieDecision = decideWindowsGpuStackCookieLaunch({
    argv: process.argv,
    marker: readGpuStackCookieMarker(windowsGpuUserData),
    env: process.env,
    appVersion: app.getVersion()
  })

  windowsGpuStackCookieFallbackActive = gpuStackCookieDecision.enable
  windowsGpuStackCookieFallbackSticky = gpuStackCookieDecision.nextMarker.state === 'fallback'

  try {
    writeGpuStackCookieMarker(windowsGpuUserData, gpuStackCookieDecision.nextMarker)
  } catch {
    void 0
  }

  if (gpuStackCookieDecision.enable && !REMOTE_DISPLAY_REASON) {
    app.disableHardwareAcceleration()
    app.commandLine.appendSwitch('disable-gpu-compositing')
    console.log(
      `[hermes] Windows GPU stack-cookie fallback enabled (${gpuStackCookieDecision.reason}); disabling GPU hardware acceleration (0xC0000409 / #108047)`
    )
  }
}

// Renderer debugging port. On for dev-server runs (`hgui` / `npm run dev`) so
// the CDP tooling in scripts/ can attach; never for a packaged build — see
// electron/dev-cdp.ts. Must run before app `ready` like the switches above;
// Chromium binds it at launch.
const DEV_CDP = resolveDevCdpPort({ env: process.env, isPackaged: IS_PACKAGED, devServer: DEV_SERVER })

if (DEV_CDP.port) {
  app.commandLine.appendSwitch('remote-debugging-port', String(DEV_CDP.port))
  // Loopback only. Chromium already defaults to 127.0.0.1, but say it out loud
  // so a future edit can't widen it by omission.
  app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1')
  console.log(
    `[hermes] renderer debugging on http://127.0.0.1:${DEV_CDP.port} — anything that can reach it ` +
      'can run code in the renderer. HERMES_DESKTOP_CDP_PORT=off to disable.'
  )
} else {
  const why = describeDevCdpDecision(DEV_CDP)

  if (why) {
    console.warn(`[hermes] ${why}`)
  }
}

// WSLg: Chromium blocklists the Mesa vGPU → software compositing → typing lag.
// /dev/dxg means a real GPU is available; un-blocklist it. Skipped when a remote
// display already forced software (SSH'd-into-WSL), and on Wayland ozone: WSL has
// no DRM render node, so forced GPU compositing segfaults the GPU process there.
if (
  IS_WSL &&
  !REMOTE_DISPLAY_REASON &&
  fs.existsSync('/dev/dxg') &&
  linuxOzoneBackend(process.env, process.argv) !== 'wayland'
) {
  app.commandLine.appendSwitch('ignore-gpu-blocklist')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  console.log('[hermes] WSL GPU passthrough (/dev/dxg) detected; enabling GPU acceleration')
}

// #40077 / #124255: NVIDIA driver 580.x breaks ANGLE's EGL probing (Invalid
// visual ID), killing the GPU process at startup. Route ANGLE through its
// SwiftShader backend when the breakage is WITNESSED, not assumed: the same
// point release breaks hosts where NVIDIA drives the display and renders fine
// on hybrid hosts whose session EGL lands on the iGPU, so a driver-series gate
// burns 4-9 CPU cores on healthy hosts (#124255). The gate is now behavioral —
// boot with hardware GL and a marker; a GPU-process death before the first
// window flips the marker sticky (per app + full driver version) and relaunches
// once with SwiftShader. Deliberately NOT disableHardwareAcceleration(): on
// 580.173.02 + Electron 40 that SIGKILLs the renderer (see the closed #40119).
// Must run before app `ready` — the switch only applies pre-launch. Override
// with HERMES_DESKTOP_NVIDIA_SWIFTSHADER (1/true → force on, 0/false → never).
const NVIDIA_PROC_VERSION = (() => {
  try {
    return fs.readFileSync('/proc/driver/nvidia/version', 'utf8')
  } catch {
    return ''
  }
})()

const NVIDIA_DRIVER_MAJOR = parseNvidiaDriverMajor(NVIDIA_PROC_VERSION)
const NVIDIA_DRIVER_VERSION = parseNvidiaDriverVersion(NVIDIA_PROC_VERSION)

let nvidiaEglFallbackActive = false
let nvidiaEglRelaunchAttempted = false

const NVIDIA_EGL_FALLBACK = decideNvidiaEglFallback({
  driverMajor: NVIDIA_DRIVER_MAJOR,
  driverVersion: NVIDIA_DRIVER_VERSION,
  marker: readNvidiaEglMarker(app.getPath('userData')),
  appVersion: app.getVersion(),
  env: process.env,
  platform: process.platform,
  isWsl: IS_WSL,
  remoteDisplayReason: REMOTE_DISPLAY_REASON
})

nvidiaEglFallbackActive = NVIDIA_EGL_FALLBACK.enable

// Persist the launch decision before GPU children start: a `booting` marker
// left behind by a launch that never reached first paint is itself evidence
// of a GPU death (the "GPU process isn't usable" FATAL abort wins the race
// against our relaunch handler), and the next launch engages from it.
if (NVIDIA_DRIVER_MAJOR !== null) {
  try {
    writeNvidiaEglMarker(app.getPath('userData'), NVIDIA_EGL_FALLBACK.nextMarker)
  } catch {
    void 0
  }
}

if (NVIDIA_EGL_FALLBACK.enable) {
  app.commandLine.appendSwitch('use-angle', 'swiftshader')
  console.log(
    `[hermes] NVIDIA EGL fallback enabled (${NVIDIA_EGL_FALLBACK.reason}); routing ANGLE ` +
      'through SwiftShader. Witnessed GPU-process death probe (#40077, #124255); an app or ' +
      'driver update re-probes hardware GL once. HERMES_DESKTOP_NVIDIA_SWIFTSHADER=0 to opt out.'
  )
}

// The behavioral half of the gate: a GPU-process death on a Linux NVIDIA host
// that booted with hardware GL is the #40077 signature. Catch it before
// Chromium's "GPU process isn't usable" FATAL abort ends the process, flip the
// marker sticky, and relaunch once with SwiftShader. `killed` counts (the
// #40077 GPU process died to Chromium's health-check SIGTERM, exit_code=15).
if (NVIDIA_DRIVER_MAJOR !== null && process.platform === 'linux') {
  app.on('child-process-gone', (_event, details) => {
    if (
      !shouldRelaunchForNvidiaGpuDeath({
        details,
        fallbackActive: nvidiaEglFallbackActive,
        relaunchAttempted: nvidiaEglRelaunchAttempted
      })
    ) {
      return
    }

    nvidiaEglRelaunchAttempted = true

    try {
      writeNvidiaEglMarker(
        app.getPath('userData'),
        nvidiaEglFallbackMarker(app.getVersion(), NVIDIA_DRIVER_VERSION ?? String(NVIDIA_DRIVER_MAJOR))
      )
    } catch {
      void 0
    }

    console.warn(
      `[hermes] NVIDIA GPU process died (reason=${details?.reason}, exit=${details?.exitCode}); ` +
        'relaunching once with --use-angle=swiftshader (#40077, #124255)'
    )

    try {
      app.relaunch({
        args: [...process.argv.slice(1), '--use-angle=swiftshader']
      })
      void exitAfterBackendShutdown(0)
    } catch (error) {
      console.error(`[hermes] NVIDIA SwiftShader relaunch failed: ${error?.message || error}`)
    }
  })
}

// #124843: on Mesa/Wayland the Chromium GPU child can fail init
// (error_code=1002) and retry inside a sub-zygote forever — ~350% CPU, no
// gpu-process, no crash. Bound it: one relaunch into software rendering,
// then a sticky per-version marker so the next boot goes straight there.
// Reactive only — healthy Mesa/Wayland stacks keep full acceleration. Must
// run before app `ready`. Override with HERMES_DESKTOP_DISABLE_GPU
// (1/true → always software, 0/false → keep GPU on).
let linuxGpuFallbackActive = false
let linuxGpuFallbackSticky = false
let linuxGpuRelaunchAttempted = false

const LINUX_GPU_SOFTWARE_ACTIVE =
  Boolean(REMOTE_DISPLAY_REASON) || NVIDIA_EGL_FALLBACK.enable || alreadyHasDisableGpu(process.argv, process.env)

if (process.platform === 'linux') {
  const linuxGpuUserData = app.getPath('userData')

  const linuxGpuDecision = decideLinuxGpuLaunch({
    argv: process.argv,
    env: process.env,
    marker: readLinuxGpuMarker(linuxGpuUserData),
    appVersion: app.getVersion(),
    remoteDisplayReason: REMOTE_DISPLAY_REASON,
    nvidiaFallbackActive: NVIDIA_EGL_FALLBACK.enable
  })

  linuxGpuFallbackActive = linuxGpuDecision.enable
  linuxGpuFallbackSticky = linuxGpuDecision.nextMarker.state === 'fallback'

  try {
    writeLinuxGpuMarker(linuxGpuUserData, linuxGpuDecision.nextMarker)
  } catch {
    void 0
  }

  if (linuxGpuDecision.enable && linuxGpuDecision.reason !== 'already-enabled' && !LINUX_GPU_SOFTWARE_ACTIVE) {
    app.disableHardwareAcceleration()
    app.commandLine.appendSwitch('disable-gpu-compositing')
    console.log(
      `[hermes] Linux GPU software fallback enabled (${linuxGpuDecision.reason}); disabling GPU ` +
        'hardware acceleration after a GPU-child init failure (#124843). HERMES_DESKTOP_DISABLE_GPU=0 to opt out.'
    )
  }
}

// Linux: point Chromium at the session's keychain backend so safeStorage can
// encrypt remote gateway tokens (hardening.ts refuses to persist them without
// it). The value arrives via HERMES_DESKTOP_PASSWORD_STORE, bridged by the
// `hermes desktop` launcher from detection or `desktop.password_store` in
// config.yaml. Must run before app `ready` — the switch only applies pre-launch.
const PASSWORD_STORE = resolveLinuxPasswordStore()

if (PASSWORD_STORE.warning) {
  console.warn(`[hermes] ${PASSWORD_STORE.warning}`)
}

if (PASSWORD_STORE.store) {
  app.commandLine.appendSwitch('password-store', PASSWORD_STORE.store)
  console.log(`[hermes] using password-store backend: ${PASSWORD_STORE.store}`)
}

// Windows sandbox / GPU breakpoint crash recovery (#38216).
//
// Some hosts (AMD RX 6000 drivers, orphan AppContainer SIDs under %LOCALAPPDATA%,
// missing S-1-15-2-2 ACEs) kill Chromium's sandboxed GPU/renderer children with
// 0x80000003. After enough GPU deaths the browser process FATAL-exits before the
// UI is usable. Must run before app `ready` so `--no-sandbox` applies to child
// processes. The sticky marker recovers Start Menu / shortcut launches that
// never go through `hermes desktop`; it is version-scoped so an app update
// re-probes the sandbox instead of degrading forever.
//
// `windowsSandboxFallbackActive` = this process runs without the Chromium
// sandbox (any cause, including a manual --no-sandbox flag) — guards the
// relaunch handlers. `windowsSandboxFallbackSticky` = the fallback machinery
// engaged and the marker must stay `fallback` after a successful boot; a
// manual flag alone is honored but never made sticky.
let windowsSandboxFallbackActive = false
let windowsSandboxFallbackSticky = false
let windowsSandboxFallbackReason: SandboxFallbackReason = 'boot-loop'
let windowsNoSandboxRelaunchAttempted = false

// #121954: the two-strike boot-abort ladder now also covers Linux. On Linux
// hosts where the sandboxed GPU child cannot start (dies pre-main on an
// FD-ownership violation), Chromium prints "GPU process isn't usable.
// Goodbye." and aborts — a 100% crash loop; the host isolation matrix in
// #121954 shows only `--no-sandbox` reaches the UI. Same sticky per-version
// recovery as #38216: two consecutive mid-boot aborts engage `--no-sandbox`,
// an app update re-probes the sandbox once. Windows-only extras (ACL repair,
// renderer crash-loop relaunch) stay inside the IS_WINDOWS branch.
if (IS_WINDOWS || process.platform === 'linux') {
  const windowsUserData = app.getPath('userData')
  const priorMarker = readSandboxMarker(windowsUserData)

  // Best-effort ACL repair, only when the last boot aborted or the fallback is
  // engaged — icacls /T recurses the whole install tree, so healthy launches
  // skip it (the installer already granted the ACE at install time). Repair
  // targets the install dir only: granting AppContainer read on userData would
  // expose Hermes sessions/config to every packaged app on the machine.
  if (shouldAttemptAclRepair(priorMarker)) {
    const exeDir = path.dirname(process.execPath)
    const acl = grantAllApplicationPackagesAcl(exeDir, { execFileSync })

    if (acl.ok) {
      console.log(`[hermes] granted ALL APPLICATION PACKAGES RX on ${exeDir} (#38216)`)
    } else if (acl.error && acl.error !== 'missing-target-or-exec') {
      console.warn(`[hermes] AppContainer ACL grant failed on ${exeDir}: ${acl.error}`)
    }
  }

  const sandboxDecision = decideWindowsSandboxLaunch({
    argv: process.argv,
    env: process.env,
    marker: priorMarker,
    appVersion: app.getVersion()
  })

  windowsSandboxFallbackActive = sandboxDecision.enable
  windowsSandboxFallbackSticky = sandboxDecision.nextMarker.state === 'fallback'

  if (sandboxDecision.nextMarker.state === 'fallback' && sandboxDecision.nextMarker.reason) {
    windowsSandboxFallbackReason = sandboxDecision.nextMarker.reason
  }

  if (sandboxDecision.enable && sandboxDecision.reason !== 'already-enabled') {
    app.commandLine.appendSwitch('no-sandbox')
    process.env.ELECTRON_DISABLE_SANDBOX = '1'
    console.log(
      `[hermes] sandbox fallback enabled (${sandboxDecision.reason}); launching with --no-sandbox (#38216, #121954)`
    )
  }

  writeSandboxMarker(windowsUserData, sandboxDecision.nextMarker)

  // One coalesced Linux GPU-child recovery (#86073, #124843, #121954): the
  // sandbox signature is tried first (that host's matrix shows --disable-gpu
  // still crashes), then the software ladder — including the relapse after a
  // --no-sandbox boot died again. One death, one bounded relaunch; Windows
  // keeps its breakpoint-signature fast path unchanged.
  app.on('child-process-gone', (_event, details) => {
    if (IS_WINDOWS) {
      if (
        !shouldRelaunchForGpuSandboxCrash({
          details,
          alreadyNoSandbox: windowsSandboxFallbackActive || alreadyHasNoSandbox(process.argv, process.env),
          relaunchAttempted: windowsNoSandboxRelaunchAttempted
        })
      ) {
        return
      }

      windowsNoSandboxRelaunchAttempted = true
      windowsSandboxFallbackActive = true
      windowsSandboxFallbackSticky = true
      windowsSandboxFallbackReason = 'gpu-breakpoint'

      try {
        writeSandboxMarker(app.getPath('userData'), fallbackMarker('gpu-breakpoint', app.getVersion()))
      } catch {
        void 0
      }

      console.warn(
        `[hermes] GPU child died with the sandbox signature (exit=${details?.exitCode}); relaunching once with --no-sandbox (#38216)`
      )

      try {
        app.relaunch({ args: buildNoSandboxRelaunchArgs(process.argv.slice(1)) })
        void exitAfterBackendShutdown(0)
      } catch (error) {
        console.error(`[hermes] --no-sandbox relaunch failed: ${error?.message || error}`)
      }

      return
    }

    const alreadySoftware =
      LINUX_GPU_SOFTWARE_ACTIVE || linuxGpuFallbackActive || alreadyHasDisableGpu(process.argv, process.env)

    const path = linuxGpuChildDeathPath({
      details,
      alreadyNoSandbox: windowsSandboxFallbackActive || alreadyHasNoSandbox(process.argv, process.env),
      alreadySoftware,
      sandboxRelaunchAttempted: windowsNoSandboxRelaunchAttempted,
      softwareRelaunchAttempted: linuxGpuRelaunchAttempted
    })

    if (path === 'no-sandbox') {
      windowsNoSandboxRelaunchAttempted = true
      windowsSandboxFallbackActive = true
      windowsSandboxFallbackSticky = true
      windowsSandboxFallbackReason = 'gpu-breakpoint'

      try {
        writeSandboxMarker(app.getPath('userData'), fallbackMarker('gpu-breakpoint', app.getVersion()))
      } catch {
        void 0
      }

      console.warn(
        `[hermes] Linux GPU child died with the sandbox signature (exit=${details?.exitCode}); relaunching once with --no-sandbox (#121954)`
      )

      try {
        app.relaunch({ args: buildNoSandboxRelaunchArgs(process.argv.slice(1)) })
        void exitAfterBackendShutdown(0)
      } catch (error) {
        console.error(`[hermes] --no-sandbox relaunch failed: ${error?.message || error}`)
      }

      return
    }

    if (path === 'disable-gpu') {
      linuxGpuRelaunchAttempted = true
      linuxGpuFallbackActive = true
      linuxGpuFallbackSticky = true

      const reason =
        String(details?.reason || '').toLowerCase() === 'launch-failure' ? 'gpu-launch-failure' : 'gpu-crash'

      try {
        writeLinuxGpuMarker(app.getPath('userData'), linuxGpuFallbackMarker(reason, app.getVersion()))
      } catch {
        void 0
      }

      console.warn(
        `[hermes] Linux GPU child gone (reason=${details?.reason}); relaunching once with --disable-gpu (#124843)`
      )

      try {
        app.relaunch({ args: buildDisableGpuRelaunchArgs(process.argv.slice(1)) })
        void exitAfterBackendShutdown(0)
      } catch (error) {
        console.error(`[hermes] --disable-gpu relaunch failed: ${error?.message || error}`)
      }
    }
  })
}

ipcMain.handle('hermes:get-remote-display-reason', () => REMOTE_DISPLAY_REASON)

// Keep the renderer's PROCESS priority normal while its windows are hidden —
// a deprioritized renderer streams a live answer visibly slower once the
// window is minimized. This switch only affects scheduling priority; it does
// not exempt timers from throttling and costs nothing at idle.
//
// The timer/rAF throttling story is deliberately NOT handled here anymore.
// The old process-wide `disable-background-timer-throttling` /
// `disable-backgrounding-occluded-windows` switches (plus a static
// `backgroundThrottling: false` on every chat window) pinned every renderer's
// `document.visibilityState` to 'visible' forever — which silently turned all
// the renderer's visibility-gated backstop polls and clock ticks into
// always-on timers. A completely idle, minimized Hermes burned ~20% CPU
// around the clock. Throttling is now a runtime dial scoped to streaming:
// see createStreamThrottle() — chat windows are unthrottled while any turn is
// in flight (so a live answer keeps painting while blurred, occluded, or
// minimized, exactly as before) and return to Chromium's default throttling
// once the work settles.
app.commandLine.appendSwitch('disable-renderer-backgrounding')

const SOURCE_REPO_ROOT = path.resolve(APP_ROOT, '../..')

// Runtime identity comes only from the baked artifact stamp. Dev runs have none.
if (INSTALL_STAMP) {
  console.log(
    `[hermes] install stamp: ${INSTALL_STAMP.commit ? INSTALL_STAMP.commit.slice(0, 12) : 'no-commit'}${INSTALL_STAMP.branch ? ` (${INSTALL_STAMP.branch})` : ''}${INSTALL_STAMP.dirty ? ' [DIRTY]' : ''} from ${INSTALL_STAMP.source || 'unknown'}`
  )
} else if (IS_PACKAGED) {
  // Dev builds without a stamp are normal; packaged builds without one
  // mean the bootstrap won't know what to clone. Surface clearly.
  console.error(
    '[hermes] WARNING: no install-stamp.json found in packaged build. First-launch bootstrap will not have a pinned ref to install.'
  )
}

const DESKTOP_PROFILE_CONFIG_PATH: string = path.join(app.getPath('userData'), 'active-profile.json')

// Only the lock-owning destination may adopt a workspace or start a backend.
// #78101: on Linux/X11 a zombie/defunct Electron process leaves the
// SingletonLock symlink behind with a PID that still answers kill(pid, 0),
// so Chromium's own liveness probe keeps refusing every later launch and the
// app silently exits. Clear a provably-dead owner and retry once; always log
// when the lock is legitimately lost so the exit is diagnosable.
function acquireSingleInstanceLock(): boolean {
  if (app.requestSingleInstanceLock()) {
    return true
  }

  const stalePid = removeStaleSingletonLock(app.getPath('userData'))

  if (stalePid !== null) {
    console.error(`[hermes] removed stale SingletonLock (owner ${stalePid} dead); retrying launch`)

    return app.requestSingleInstanceLock()
  }

  return false
}

const isPrimaryInstance: boolean = acquireSingleInstanceLock()

if (!isPrimaryInstance) {
  console.error('[hermes] another Hermes Desktop instance holds the single-instance lock; exiting')
  app.exit(0)
}

// `hermes desktop` shortens TMPDIR only so the lock above can bind its socket (#124688). The
// backend and every other child get the real one (the profile scratch dir) back.
if (process.env.HERMES_DESKTOP_TMPDIR) {
  process.env.TMPDIR = process.env.HERMES_DESKTOP_TMPDIR
  delete process.env.HERMES_DESKTOP_TMPDIR
}

const HERMES_HOME: string = resolveDesktopHermesHome({
  home: app.getPath('home'),
  directoryExists,
  readWindowsHome: (): string | null => readWindowsUserEnvVar('HERMES_HOME')
})

// #77311: `desktop.electron_flags` and the renderer heap ceiling
// (`desktop.renderer_max_old_space_mb`) used to reach Chromium only through
// the `hermes desktop` launcher's argv, so a packaged app opened from its
// Start-menu / .desktop entry ran with no `--js-flags` at all. Apply them here
// from config.yaml, before `ready` — Chromium copies `js-flags` to renderer
// processes only from the browser's pre-launch command line.
// `desktop.ssh_path` (#103288) rides the same pre-window read: an explicit
// Windows ssh client for when the in-box OpenSSH is missing or broken.
let desktopSshPathOverride = ''

{
  let desktopLaunchYaml: string = ''

  try {
    desktopLaunchYaml = fs.readFileSync(path.join(HERMES_HOME, 'config.yaml'), 'utf8')
  } catch {
    void 0 // first run: no config yet → Chromium defaults
  }

  const desktopLaunchConfig = readDesktopLaunchConfig(desktopLaunchYaml)
  desktopSshPathOverride = desktopLaunchConfig.sshPath || ''

  // `desktop.renderer_accessibility: false` must reach packaged launches too,
  // not only the `hermes desktop` launcher's env bridge (#118271).
  if (
    desktopLaunchConfig.rendererAccessibility === false &&
    process.env.HERMES_DESKTOP_RENDERER_ACCESSIBILITY === undefined
  ) {
    process.env.HERMES_DESKTOP_RENDERER_ACCESSIBILITY = '0'
  }

  for (const planned of planLaunchSwitches(desktopLaunchConfig, process.argv.slice(1))) {
    if (planned.value === undefined) {
      app.commandLine.appendSwitch(planned.name)
    } else {
      app.commandLine.appendSwitch(planned.name, planned.value)
    }

    console.log(
      `[hermes] desktop launch switch from config.yaml: --${planned.name}${planned.value === undefined ? '' : `=${planned.value}`}`
    )
  }
}

// ACTIVE_HERMES_ROOT — the canonical mutable Hermes install. Same path
// install.ps1 / install.sh use, so a desktop-only user and a CLI-only user end
// up with identical layouts and can share one install.
const ACTIVE_HERMES_ROOT = path.join(HERMES_HOME, 'hermes-agent')
setNoConsoleGitRoots([!IS_PACKAGED ? SOURCE_REPO_ROOT : null, ACTIVE_HERMES_ROOT])
// VENV_ROOT — venv lives inside the repo, exactly like install.ps1 does it.
const VENV_ROOT = path.join(ACTIVE_HERMES_ROOT, 'venv')
// BOOTSTRAP_COMPLETE_MARKER — written by the first-launch bootstrap runner
// (Phase 1D) after install.ps1 has completed all stages and the user has
// finished initial configuration. Presence of this marker means the install
// is in a known-good state and we can skip the bootstrap flow on subsequent
// boots, going straight to `resolveHermesBackend()`. Missing or stale marker
// means we re-run the bootstrap; install.ps1's stages are idempotent so a
// re-run on an already-good install just discovers everything in place.
//
// We deliberately put the marker INSIDE ACTIVE_HERMES_ROOT (not alongside)
// so that deleting the checkout to start fresh also deletes the marker --
// avoids the confusing "marker exists but checkout is gone" state.
const BOOTSTRAP_COMPLETE_MARKER = path.join(ACTIVE_HERMES_ROOT, '.hermes-bootstrap-complete')
const BOOTSTRAP_MARKER_SCHEMA_VERSION = 1

const DESKTOP_CONNECTION_CONFIG_PATH = path.join(app.getPath('userData'), 'connection.json')
// v2 multi-connection registry (named agent sources). Lives BESIDE
// connection.json — v1 stays on disk untouched so older builds sharing the
// profile keep working; the registry imports from it once and then owns its
// own file. Same secret posture as connection.json (encrypted tokens, 0600).
const DESKTOP_CONNECTIONS_REGISTRY_PATH = path.join(app.getPath('userData'), 'connections.json')
const DESKTOP_INSTALLATION_PATH = path.join(app.getPath('userData'), 'desktop-installation.json')
const DESKTOP_UPDATE_CONFIG_PATH = path.join(app.getPath('userData'), 'updates.json')
const DESKTOP_WINDOW_STATE_PATH = path.join(app.getPath('userData'), 'window-state.json')
const DESKTOP_BACKEND_OWNERSHIP_PATH = path.join(app.getPath('userData'), 'backend-ownership.json')
const DESKTOP_MANAGED_SSH_RECOVERY_PATH = path.join(app.getPath('userData'), 'managed-ssh-update-recovery.json')
// active-profile.json records which Hermes profile the desktop launches its
// local backend as. When set, startHermes() passes `hermes --profile <name>
// dashboard …`, which deterministically pins HERMES_HOME (see
// _apply_profile_override in hermes_cli/main.py) and bypasses the sticky
// ~/.hermes/active_profile file. Unset (null) preserves the legacy behavior:
// no --profile flag, so the backend honors active_profile / default.

// Mirrors hermes_cli.profiles._PROFILE_ID_RE so we never hand the backend a
// value its profile resolver would reject and exit on.
const PROFILE_NAME_RE = DESKTOP_PROFILE_NAME_RE
// Branch we track for self-update. The GUI work has merged to main, so this
// tracks main. User can also override at runtime via
// hermesDesktop.updates.setBranch().
const DEFAULT_UPDATE_BRANCH = 'main'
// desktop.log lives under HERMES_HOME/logs/ so it sits next to agent.log,
// errors.log, gateway.log produced by hermes_logging.setup_logging — one log
// directory per user, regardless of which UI surface produced the line.
const DESKTOP_LOG_PATH = path.join(HERMES_HOME, 'logs', 'desktop.log')
const DESKTOP_LOG_FLUSH_MS = 120
const DESKTOP_LOG_BUFFER_MAX_CHARS = 64 * 1024
// Bound desktop.log on disk. It is an append-only forensic log, so a boot loop
// (version-skew crash -> backend exits instantly -> renderer keeps hitting
// Retry) appends the full bootstrap transcript every attempt and grows without
// bound — we have seen it reach ~326 GB and exhaust the disk, which then breaks
// update/install (no room for git/venv/npm temp files). The cap, the cascade
// and the discard ceiling live in log-rotation.ts, shared with the Chromium
// log below.

// #100573: keep the FATAL line and a local minidump for the next Linux SIGTRAP.
// Both must be wired before `app` is ready; the log-file switch is inherited by
// every child process, so a zygote or GPU CHECK lands in the same file.
// Chromium opens an explicit --log-file with APPEND_TO_OLD_LOG_FILE, so this
// one accumulates across launches exactly like desktop.log: bound it the same
// way, and never let optional diagnostics fail the shell's startup.
const CRASH_DIAGNOSTICS_LOGS_DIR = path.dirname(DESKTOP_LOG_PATH)

const CRASH_DIAGNOSTICS = linuxCrashDiagnostics(CRASH_DIAGNOSTICS_LOGS_DIR)
const CHROMIUM_LOG_PATH = path.join(CRASH_DIAGNOSTICS_LOGS_DIR, CHROMIUM_LOG_FILENAME)

enableLinuxCrashDiagnostics(CRASH_DIAGNOSTICS, CRASH_DIAGNOSTICS_LOGS_DIR, {
  ensureLogsDir: dir => fs.mkdirSync(dir, { recursive: true }),
  reclaimChromiumLog: file => rotateLogIfNeededSync(file),
  appendSwitch: (name, value) => app.commandLine.appendSwitch(name, value),
  startCrashReporter: options => crashReporter.start(options)
})

const BOOT_FAKE_MODE = process.env.HERMES_DESKTOP_BOOT_FAKE === '1'
const BOOT_FAKE_ERROR = process.env.HERMES_DESKTOP_BOOT_FAKE_ERROR || ''
// Automated teardown (Playwright's app.close(), harness scripts) quits with
// nobody to answer a modal, so the active-work confirmation would hang the
// caller instead of letting the process exit. Force quits set this.
const SKIP_QUIT_CONFIRM = process.env.HERMES_DESKTOP_SKIP_QUIT_CONFIRM === '1'
// One launch decision must reach both the renderer and every backend spawn.
const GUEST_ONBOARDING: boolean = guestOnboardingEnabled()

const BOOT_FAKE_STEP_MS = (() => {
  const raw = Number.parseInt(String(process.env.HERMES_DESKTOP_BOOT_FAKE_STEP_MS || ''), 10)

  if (!Number.isFinite(raw) || raw <= 0) {
    return 650
  }

  return Math.max(120, raw)
})()

const APP_NAME: string = IDENTITY_APP_NAME || process.env.HERMES_DESKTOP_APP_NAME || 'Hermes'
const HUD_WINDOW_TITLE = `${APP_NAME} HUD`
const TITLEBAR_HEIGHT = 34
const MACOS_TRAFFIC_LIGHTS_HEIGHT = 14

const WINDOW_BUTTON_POSITION = {
  x: 24,
  y: TITLEBAR_HEIGHT / 2 - MACOS_TRAFFIC_LIGHTS_HEIGHT / 2
}

// Right-edge window-control reservation lives in titlebar-overlay-width.ts
// (pure + unit-testable); computeNativeOverlayWidth() applies it per platform.
// It's only the pre-layout fallback — the renderer measures the exact overlay
// width live via the Window Controls Overlay API.
// The apple-touch PNG bakes in the macOS-style ~10% margin, which is correct
// for the dock but renders visibly smaller than neighboring taskbar icons on
// Windows, where icons are full-bleed. Windows prefers the full-bleed
// assets/icon.ico (shipped to resources/ via extraResources) and only falls
// back to the padded PNG if the ico is missing.
// The ladder is BUILT once here but each window factory RE-RESOLVES through
// resolveAppIcon (decoding probe): existence alone is not proof the bytes
// decode, and an undecodable icon must never take the main process down.
const APP_ICON_PATHS = appIconCandidates({
  isWindows: IS_WINDOWS,
  appRoot: APP_ROOT,
  resourcesPath: process.resourcesPath,
  unpackedPathFor
})

let rendererTitleB…157947 tokens truncated…Source = mode
    writePersistedThemeSource(mode)
  }
})

// See-through window translucency. Persist + re-apply to every open window at
// runtime (no recreation, so caching/sessions are untouched).
//
// The intensity slider is a HOT path: ~100 updates per drag. Two things make
// that cheap. Native work is diffed, so an intensity-only change under glass
// touches nothing (it's painted by the renderer). And the disk write is
// coalesced onto a trailing timer, because writePersistedTranslucency is a
// synchronous writeFileSync and doing one per tick blocks the main process
// mid-drag. Only a cold launch reads that file, so it just has to be correct
// once the hand comes off the slider.
let translucencyWriteTimer = null

function scheduleTranslucencyWrite() {
  if (translucencyWriteTimer) {
    clearTimeout(translucencyWriteTimer)
  }

  translucencyWriteTimer = setTimeout(() => {
    translucencyWriteTimer = null
    writePersistedTranslucency(translucencyState)
  }, 250)
}

// Flush a pending write before the process can exit, so a quit landing inside
// the debounce window doesn't lose the setting.
app.on('before-quit', () => {
  if (translucencyWriteTimer) {
    clearTimeout(translucencyWriteTimer)
    translucencyWriteTimer = null
    writePersistedTranslucency(translucencyState)
  }
})

// Close the pooled keep-alive sockets on quit so lingering connections can't
// hold the event loop open or leak FDs past app teardown.
app.on('will-quit', () => {
  killTimedGitChildren()
  sshIsolatedKeepalives.stopAll()
  destroyKeepaliveAgents()
  nativeNotifications.dispose()
  quitFinalization.arm()
})

app.on('quit', () => {
  quitFinalization.cancel()
})

// Answered synchronously so preload can publish the verdict before the
// renderer's first script — see the note there on why it cannot decide this
// itself. Registered at module scope, which runs long before any window.
ipcMain.on('hermes:translucency:support', event => {
  event.returnValue = { glass: GLASS_SUPPORTED, translucency: TRANSLUCENCY_SUPPORTED }
})

// Feature-flag facts the renderer needs before first paint (same sendSync
// pattern as translucency). Resolved in feature-flags.ts from the launch
// argv and the artifact's channel: `--local` (from `hermes desktop --local`
// or directly on Hermes.exe, a shortcut edit) gates the local-models GUI on
// stable builds, and canary builds get the same surfaces by default. Launch
// flags survive self-relaunches because collectRelaunchArgs only strips
// internal flags.
ipcMain.on('hermes:feature-flags', (event: IpcMainEvent): void => {
  event.returnValue = {
    ...resolveFeatureFlags({
      argv: process.argv,
      canary: resolveUpdaterChannelFromStamp() === 'canary'
    }),
    guestOnboarding: GUEST_ONBOARDING
  }
})

ipcMain.on('hermes:translucency', (_event, payload) => {
  const next = normalizeTranslucency(payload, GLASS_SUPPORTED)
  const previous = translucencyState

  if (
    next.intensity === previous.intensity &&
    next.fade === previous.fade &&
    next.mode === previous.mode &&
    next.material === previous.material &&
    next.scope === previous.scope
  ) {
    return
  }

  translucencyState = next

  // Which native properties actually moved. `scope` is renderer-only (which
  // surfaces thin), so it never appears here.
  const changed = {
    // The backing follows whether glass is ON, not the intensity behind it.
    backing: glassActive(previous) !== glassActive(next),
    material: vibrancyForTranslucency(previous) !== vibrancyForTranslucency(next),
    opacity: windowOpacityFor(previous) !== windowOpacityFor(next)
  }

  scheduleTranslucencyWrite()

  // The HUD's frost reads the same setting but answers on its own terms (see
  // hudFrostFor) — and it is a transparent window, so it is deliberately not
  // in the chat fan-out below. It self-diffs, so an unrelated change costs
  // nothing native.
  hudIpc.applyHudFrost()

  if (changed.backing || changed.material || changed.opacity) {
    for (const win of BrowserWindow.getAllWindows()) {
      applyWindowTranslucency(win, changed)
    }
  }
})

// Keep-awake: hold the machine awake for long/overnight runs. Main owns the one
// blocker and its persisted state so a cold launch restores it (applied on
// ready — powerSaveBlocker needs the app ready). The renderer toggles it from
// Settings → Advanced over IPC. See store/keep-awake.
const KEEP_AWAKE_CONFIG_PATH = path.join(app.getPath('userData'), 'keep-awake.json')
const keepAwake = createKeepAwake(powerSaveBlocker)

function readPersistedKeepAwake() {
  try {
    return JSON.parse(fs.readFileSync(KEEP_AWAKE_CONFIG_PATH, 'utf8')).on === true
  } catch {
    return false
  }
}

ipcMain.on('hermes:keep-awake', (_event, on) => {
  const enabled = Boolean(on)
  keepAwake.set(enabled)

  try {
    fs.mkdirSync(path.dirname(KEEP_AWAKE_CONFIG_PATH), { recursive: true })
    fs.writeFileSync(KEEP_AWAKE_CONFIG_PATH, JSON.stringify({ on: enabled }, null, 2), 'utf8')
  } catch (error) {
    rememberLog(`[keep-awake] write failed: ${error.message}`)
  }
})

// Quick Entry: the renderer reads the live registration state on settings mount
// and writes the preference back. Main is authoritative — it owns the OS
// accelerator — so both handlers return the state that ACTUALLY resulted,
// including `registered: false` + `error: 'taken'` when another app owns the
// chord. See electron/quick-entry.ts + store/quick-entry.
ipcMain.handle('hermes:quick-entry:settings:get', async () => {
  const settings = readQuickEntrySettings()
  const state = quickEntryShortcut.current()

  // Ground truth is what the last apply produced; the shortcut we report is the
  // live one (a saved-but-rejected chord still shows what the user asked for).
  return {
    enabled: settings.enabled,
    error: state.error,
    registered: state.registered,
    shortcut: settings.enabled ? state.shortcut : settings.shortcut
  }
})

ipcMain.handle('hermes:quick-entry:settings:set', async (_event, patch) => {
  const current = readQuickEntrySettings()

  const next = sanitizeQuickEntrySettings({
    enabled: patch?.enabled === undefined ? current.enabled : patch.enabled === true,
    shortcut: typeof patch?.shortcut === 'string' && patch.shortcut.trim() ? patch.shortcut : current.shortcut
  })

  writeQuickEntrySettings(next)

  return applyQuickEntrySettings(next)
})

// Quick window → main → PRIMARY renderer. We never submit here: the renderer
// owns the one prompt-submit path, and forwarding keeps it that way. The
// payload is `{ target, text }` — target routing (current chat / a picked
// session / new) is the renderer's job too.
const quickEntrySubmitRelay = createQuickEntrySubmitRelay({
  // A late ack for a timed-out submit proves the outcome. Forward it to the
  // capture window so it can reconcile the unknown state instead of the user
  // resending a prompt that may already be delivered.
  onLateResult: (correlationId, result) => {
    if (quickEntryWindow && !quickEntryWindow.isDestroyed()) {
      quickEntryWindow.webContents.send('hermes:quick-entry:late-result', { correlationId, result })
    }
  },
  onSuccess: () => {
    hideQuickEntryWindow()

    if (process.platform === 'darwin') {
      app.dock?.show()
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }
  }
})

// Main owns the request lifecycle so the capture window can keep text until
// the primary renderer confirms delivery (#85590).
ipcMain.handle('hermes:quick-entry:submit', (event, payload) => {
  if (!quickEntryWindow || event.sender !== quickEntryWindow.webContents) {
    return { code: 'forbidden', message: 'Quick Entry sender is not authorized.', ok: false, retryable: false }
  }

  const text =
    typeof payload === 'string' ? payload.trim() : typeof payload?.text === 'string' ? payload.text.trim() : ''

  if (!text) {
    return { code: 'empty', message: 'Enter a prompt before submitting.', ok: false, retryable: false }
  }

  if (!mainWindow || mainWindow.isDestroyed()) {
    return { code: 'no-primary', message: 'The primary Hermes window is unavailable.', ok: false, retryable: true }
  }

  const target =
    typeof payload === 'object' && typeof payload?.target === 'string' && payload.target ? payload.target : 'current'

  return quickEntrySubmitRelay.begin(correlationId => {
    mainWindow.webContents.send('hermes:quick-entry:submit', { correlationId, target, text })
  })
})

// Main cannot invoke the primary renderer, so the primary returns by id. Stale
// or duplicate acknowledgements are intentionally ignored (#85590).
ipcMain.on('hermes:quick-entry:ack', (event, payload) => {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    return
  }

  quickEntrySubmitRelay.acknowledge(payload?.correlationId, payload?.result)
})

// Primary renderer → main → quick window: gateway connection state + the
// recent-session list for the target picker. Cached so a quick window spawned
// AFTER the last push still boots from truth instead of "disconnected".
ipcMain.on('hermes:quick-entry:state', (_event, payload) => {
  quickEntryLastState = payload ?? null

  if (quickEntryWindow && !quickEntryWindow.isDestroyed()) {
    quickEntryWindow.webContents.send('hermes:quick-entry:state', payload)
  }
})

ipcMain.on('hermes:quick-entry:dismiss', () => hideQuickEntryWindow())

// Disable F12 DevTools: maintained in the main process so a cold launch
// restores it before any window is shown (applied on ready). The renderer
// toggles it from Settings → Advanced over IPC. See store/disable-f12.
const DISABLE_F12_CONFIG_PATH = path.join(app.getPath('userData'), 'disable-f12.json')

function readPersistedDisableF12() {
  try {
    return JSON.parse(fs.readFileSync(DISABLE_F12_CONFIG_PATH, 'utf8')).on === true
  } catch {
    return false
  }
}

ipcMain.on('hermes:devtools:disable-f12', (_event, on) => {
  f12Blocked = Boolean(on)

  try {
    fs.mkdirSync(path.dirname(DISABLE_F12_CONFIG_PATH), { recursive: true })
    fs.writeFileSync(DISABLE_F12_CONFIG_PATH, JSON.stringify({ on: f12Blocked }, null, 2), 'utf8')
  } catch (error) {
    rememberLog(`[disable-f12] write failed: ${error.message}`)
  }
})

ipcMain.handle('hermes:openExternal', async (_event, url) => {
  const result = await openExternalUrl(url)

  if (result.ok === false && result.reason === 'invalid') {
    throw new Error('Invalid external URL')
  }
})

// ── Find-in-page (Ctrl/Cmd+F) ─────────────────────────────────────────────
// The desktop supports multiple BrowserWindows (one primary plus any
// per-session secondary windows spawned via `hermes:window:openSession`).
// Find must run against the requesting window, not a global — otherwise
// Cmd+F pressed in a secondary session window would search the primary
// and the match counter would report matches the user can't see. Resolve
// the sender through `BrowserWindow.fromWebContents(event.sender)` and
// forward `found-in-page` results back to that same sender.

// Lazily-installed forwarder per sender webContents. We track one
// uninstall fn per webContents id and prune entries when the sender goes
// away — Electron does not auto-detach webContents listeners on close,
// so the map is the cleanup path.
const foundInPageForwarders = new Map<number, () => void>()

function ensureFoundInPageForwarder(sender: Electron.WebContents): void {
  if (foundInPageForwarders.has(sender.id)) {
    return
  }

  const uninstall = installFoundInPageForwarder(sender)
  foundInPageForwarders.set(sender.id, uninstall)

  sender.once('destroyed', () => {
    foundInPageForwarders.get(sender.id)?.()
    foundInPageForwarders.delete(sender.id)
  })
}

ipcMain.handle('hermes:find-in-page', async (event, query, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  if (!win || win.isDestroyed()) {
    return { count: 0 }
  }

  ensureFoundInPageForwarder(event.sender)
  await performFindAfterIndexingStarted(win.webContents, query, options)

  // The match count still arrives asynchronously via `found-in-page`; this
  // reply only acknowledges that Chromium has begun returning this request.
  return { count: 0 }
})

ipcMain.handle('hermes:stop-find-in-page', event => {
  const win = BrowserWindow.fromWebContents(event.sender)

  if (!win || win.isDestroyed()) {
    return
  }

  stopFind(win.webContents)
})

// The renderer can't know whether a loopback URL is reachable — only main
// knows which transport backs this gateway. Ask before loading one.
ipcMain.handle('hermes:preview:reach', async (event, url) => reachablePreviewUrl(event.sender.id, String(url || '')))

ipcMain.handle('hermes:openPreviewInBrowser', async (_event, url) => {
  if (!(await openPreviewInBrowser(url))) {
    throw new Error('Invalid preview URL')
  }
})

// User-configurable default project directory. The renderer reads this on
// settings mount and seeds the value into the picker; writing back persists
// it via writeDefaultProjectDir so resolveHermesCwd picks it up on the next
// session spawn (no app restart needed).
ipcMain.handle('hermes:setting:defaultProjectDir:get', async () => ({
  dir: readDefaultProjectDir(),
  defaultLabel: app.getPath('home'),
  resolvedCwd: resolveHermesCwd()
}))

ipcMain.handle('hermes:workspace:sanitize', async (_event, cwd) => sanitizeWorkspaceCwd(cwd))

ipcMain.handle('hermes:setting:defaultProjectDir:set', async (_event, dir) => {
  const next = typeof dir === 'string' && dir.trim() ? dir.trim() : null

  if (next) {
    try {
      fs.mkdirSync(next, { recursive: true })
    } catch (error) {
      throw new Error(`Could not create directory: ${error.message}`)
    }
  }

  writeDefaultProjectDir(next)

  return { dir: next }
})

ipcMain.handle('hermes:setting:defaultProjectDir:pick', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Choose default project directory',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: readDefaultProjectDir() || app.getPath('home')
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true, dir: null }
  }

  return { canceled: false, dir: result.filePaths[0] }
})

ipcMain.handle('hermes:fetchLinkTitle', (_event, url) => fetchLinkTitle(url))

ipcMain.handle('hermes:resolveFavicon', (_event, url) => resolveFaviconCached(url))

ipcMain.handle('hermes:logs:reveal', async () => {
  try {
    await fs.promises.mkdir(path.dirname(DESKTOP_LOG_PATH), { recursive: true })

    if (!fileExists(DESKTOP_LOG_PATH)) {
      await fs.promises.appendFile(DESKTOP_LOG_PATH, '')
    }

    shell.showItemInFolder(DESKTOP_LOG_PATH)

    return { ok: true, path: DESKTOP_LOG_PATH }
  } catch (error) {
    return { ok: false, path: DESKTOP_LOG_PATH, error: error.message }
  }
})

ipcMain.handle('hermes:logs:recent', async () => ({ path: DESKTOP_LOG_PATH, lines: hermesLog.slice(-200) }))

// Renderer error-boundary catches (#79428 defect B): the component stack only
// exists in renderer memory, so the boundary posts it here and we persist it
// via the desktop.log pipeline. `on`, not `handle` — the sender may be mid-
// crash and must not await. Flush immediately: a crashing window can be gone
// before the debounced flush timer fires.
ipcMain.on('hermes:logs:renderer-error', (_event, report) => {
  const { label, boundary, message, componentStack } = report && typeof report === 'object' ? report : {}
  rememberLog(formatRendererBoundaryReport(label, boundary, message, componentStack))
  flushDesktopLogBufferSync()
})

// The preload reads this small, sanitized payload synchronously so the renderer
// can register the local skin before its first theme paint. It stays independent
// of the selected gateway, which can be an offline remote primary.
ipcMain.on('hermes:skin:local', event => {
  // The window route is more specific than the global next-launch preference:
  // a peer can be booting another profile while that preference changes.
  event.returnValue = readLocalSkinPayload(
    HERMES_HOME,
    windowConnectionRoutes.get(event.sender.id)?.profile,
    primaryProfileKey()
  )
})

// Renderer error toasts (notifyError): the toast shows the summarized copy,
// so the caller posts the full error here for desktop.log. Fire-and-forget,
// like renderer-error — the toast must never depend on this round-trip.
// Clamp: the line is renderer-supplied.
ipcMain.on('hermes:logs:renderer-line', (_event, line) => {
  const text = typeof line === 'string' ? line.slice(0, 6000) : ''

  if (!text) {
    return
  }

  rememberLog(text)
  flushDesktopLogBufferSync()
})

// Local filesystem + plugin-root IPC (readDir/reveal/rename/trash/…) — see fs-ipc.ts.
registerFsIpc({
  hermesHome: HERMES_HOME,
  readActiveDesktopProfile,
  expandUserPath,
  resolveRequestedPathForIpc,
  directoryExists,
  resolveGitBinary
})

// Git-driven features (worktrees, review pane, repo scan) — see git-ipc.ts.
registerGitIpc({ resolveGitBinary, resolveGhBinary })

// Client-side loopback callback for MCP OAuth against remote backends — see
// mcp-oauth-callback-ipc.ts.
registerMcpOauthCallbackIpc()

// Embedded terminal PTY host (hermes:terminal:*) — see terminal-ipc.ts.
const terminalIpc = registerTerminalIpc({
  isWindows: IS_WINDOWS,
  findOnPath,
  rememberLog,
  activeSshTerminalTarget,
  sshBinary: desktopSshBinary,
  ensureBackend: webContentsId => ensureTerminalBackend(webContentsId),
  getSshConnectionState: scope => sshConnections.get(scope)
})

const disposeTerminalSession = terminalIpc.disposeTerminalSession

ipcMain.handle(
  'hermes:updates:check',
  async (_event: Electron.IpcMainInvokeEvent, opts?: { force?: boolean }): Promise<UpdaterStatusWire> =>
    checkUpdates({ force: Boolean(opts?.force) }).catch((error: Error): UpdaterStatusWire => ({
      supported: true,
      branch: readDesktopUpdateConfig().branch,
      error: 'check-failed',
      message: error?.message || String(error),
      fetchedAt: Date.now()
    }))
)

ipcMain.handle('hermes:updates:apply', async (_event, payload) =>
  applyUpdates().catch(error => ({
    ok: false,
    error: 'apply-failed',
    message: error?.message || String(error)
  }))
)

ipcMain.handle('hermes:updates:branch:get', async () => readDesktopUpdateConfig())

ipcMain.handle(
  'hermes:updates:branch:set',
  async (_event: Electron.IpcMainInvokeEvent, name: unknown): Promise<{ branch: string }> => {
    assertSourceUpdateChannel(INSTALL_STAMP)
    const branch: string = typeof name === 'string' && name.trim() ? name.trim() : DEFAULT_UPDATE_BRANCH
    writeDesktopUpdateConfig({ branch })

    return { branch }
  }
)

function resolveHermesVersion(scope: { connectionId?: string; profile?: string } = {}): Promise<string> {
  return resolveGatewayVersion(path => handleHermesApiRequest({ ...scope, path, timeoutMs: 5000 }))
}

// Renderer-bundle skew: `hermes update` moves the SOURCE TREE, but the UI
// (including bundled plugins like Bot Mode) is compiled into this binary at
// build time. A terminal-side update — or an in-app update whose bundle-swap
// leg failed — leaves the new runtime running under an old renderer, so About
// shows the new version while the sidebar is missing that version's desktop
// features. Compare the build stamp's commit against the tree, scoped to
// apps/desktop/, and warn when the running renderer is provably behind.
// Fail-quiet: dev runs (no stamp), non-git builds, and shallow-clone gaps all
// report in-sync rather than risk a false "your install is torn" warning.
const checkRendererSkew = createBundleSkewChecker(
  INSTALL_STAMP,
  (args, options) => execGit(resolveGitBinary(), args, options),
  { isUpdating: () => updateGateReason(updateGateDeps()) !== null }
)

async function detectRendererSkew() {
  return checkRendererSkew(resolveUpdateRoot())
}

// Re-resolve the live Hermes version and push it into the native About panel
// just before showing it, so an in-place `hermes update` is reflected without
// an app restart. macOS only — `showAboutPanel()` is a no-op elsewhere, and the
// other platforms don't use this menu item.
function showAboutPanelFresh(): void {
  void Promise.all([detectRendererSkew(), resolveHermesVersion()]).then(([skew, version]) => {
    const info: AppVersionInfo = appVersionInfo(INSTALL_STAMP, version, app.getVersion())
    // The product name already identifies canary and commit builds. Never pass
    // through empty/placeholder: the panel would render the bundle's 0.0.0 (#124581).
    const display: string = nativeAboutVersion(info)
    app.setAboutPanelOptions({
      applicationName: APP_NAME,
      applicationVersion: skew.outOfSync ? `${display} — app build out of date, update the desktop app` : display,
      copyright: 'Copyright © 2026 Nous Research'
    })
    app.showAboutPanel()
  })
}

ipcMain.handle('hermes:version', async (_event, scope?: { connectionId?: string; profile?: string }) => {
  const [skew, version] = await Promise.all([detectRendererSkew(), resolveHermesVersion(scope)])

  return {
    ...appVersionInfo(INSTALL_STAMP, version, app.getVersion()),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    platform: process.platform,
    hermesRoot: resolveUpdateRoot(),
    hermesHome: HERMES_HOME,
    bundleOutOfSync: skew.outOfSync,
    bundleCommitsBehind: skew.desktopCommitsBehind,
    // The install id: sha16 of the canonical install-root path — the key of
    // this install's per-install channel record and its installs/<sha16>/
    // state folder. Same value `hermes update --install-id` prints; About
    // renders it as `sha16 (path)`.
    installId: installIdForRoot(resolveUpdateRoot(), canonicalizeInstallPath),
    // The artifact kind of THIS app plus whether the runtime checkout came
    // from a bootstrap installer script — About's Distribution row
    // disambiguates installer shells, bundles, and script installs from these.
    payload: INSTALL_STAMP?.payload,
    installedByScript: isInstallerCreatedCheckout(),
    // What this build carries and where an external backend runs from.
    // Bundled artifacts always run their payload; light artifacts have no
    // runtime and only reach remote backends. External builds classify from
    // the install stamp (git/docker/nix), 'unknown' when it can't be told.
    hermesRuntime: resolveHermesRuntime(),
    // True when the bundle on disk is not the one this process loaded — a
    // plain app restart (no rebuild, no installer) clears the skew above.
    // Packaged only: a dev `--build-only` rewrites build/install-stamp.json
    // under a running `npm start`, which is a rebuild the developer asked for,
    // not a torn install to offer a restart for.
    bundleSwapPending: IS_PACKAGED && detectBundleSwap(INSTALL_STAMP, readBundleSwapStamp(process.resourcesPath))
  }
})

// The About page's "Restart Hermes" button (shown when bundleSwapPending):
// load the already-swapped bundle without asking the user to quit manually.
// app.relaunch() re-executes by path, so the fresh process picks up whatever
// bundle now lives there.
ipcMain.handle('hermes:app:relaunch', async () => {
  rememberLog('[updates] renderer requested an app relaunch (swapped bundle pending)')
  app.relaunch({ args: buildNoSandboxRelaunchArgs(process.argv.slice(1)) })
  void exitAfterBackendShutdown(0)
})

/** The latest pm/venv/plugin-operation receipt — the machine-readable
 *  surface every medium reads (CLI: `hermes pm status`). Returned as one
 *  parsed JSON object: { kind, outcome, venv_rebuild, plugin_bisect,
 *  plugin_checks, ... } or null when no operation has run yet. The file
 *  lives at <HERMES_HOME>/logs/update_receipts/latest.json — written by
 *  pm syncs (bisect disables, failed rebuilds), plugin update checks,
 *  and (embedded) updates. */
function readLatestSyncReceipt(): Record<string, unknown> | null {
  const receiptPath = path.join(HERMES_HOME, 'logs', 'update_receipts', 'latest.json')

  try {
    const text = fs.readFileSync(receiptPath, 'utf8')
    // tolerate a BOM (hermes writes plain, but editors touch configs)
    const stripped = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

    return JSON.parse(stripped)
  } catch {
    return null
  }
}

ipcMain.handle('hermes:sync-status', () => readLatestSyncReceipt())

// Python's Path.resolve() equivalent for install-id derivation: realpath when
// the path exists, plain resolve otherwise. Must stay byte-compatible with
// boot_bootstrap._install_key or the CLI and the app would compute two
// different ids for one install.
function canonicalizeInstallPath(p: string): string {
  try {
    return fs.realpathSync(p)
  } catch {
    return path.resolve(p)
  }
}

/** True when the runtime checkout was created by a bootstrap installer
 *  (install.sh / install.ps1 / the desktop first-launch bootstrap): those all
 *  finish by writing `.hermes-bootstrap-complete` into the checkout root, and
 *  `hermes update` preserves the file, so a manual clone never grows one. A
 *  missing checkout (sealed bundled payloads, remote backends) is not
 *  installer-created. */
export function isInstallerCreatedCheckout(root: string | null = ACTIVE_HERMES_ROOT): boolean {
  if (!root) {
    return false
  }

  try {
    return fs.existsSync(path.join(root, path.basename(BOOTSTRAP_COMPLETE_MARKER)))
  } catch {
    return false
  }
}

/** Classify what this build carries (embedded / light / external). The stamp's
 *  `payload` decides the first two; an external build classifies its root via
 *  the canonical-root checkout stamp plus the bootstrap marker, or the app
 *  stamp's `source`, so About's Runtime row names
 *  git/docker/nix/desktop-bootstrap instead of a bare "external". */
function resolveHermesRuntime() {
  const stamp = INSTALL_STAMP as InstallStamp | null

  if (stamp?.payload === 'light') {
    return { type: 'light' }
  }

  if (stamp?.payload === 'bundled') {
    return { type: 'embedded' }
  }

  const root = resolveUpdateRoot()
  const canonicalStamp = readCanonicalInstallStamp()

  // A desktop first-launch bootstrap is attested by the bootstrap-complete
  // marker, not by the stamp: the stamp is the checkout's own identity
  // (source: git, written by the Python completion tail).
  if (canonicalStamp?.updateMechanism === 'self' && readBootstrapMarker()) {
    return { type: 'desktop-bootstrap', root }
  }

  const source = stamp?.source

  if (source === 'git') {
    return { type: 'git', root }
  }

  if (source === 'nix') {
    return { type: 'nix', root: null }
  }

  if (source === 'docker') {
    return { type: 'docker', root: null }
  }

  return { type: 'unknown' }
}

// ===========================================================================
// Uninstall — remove the Chat GUI (and optionally the agent / user data).
// ===========================================================================
//
// The renderer's About → Danger Zone surfaces three options that mirror the
// CLI exactly: GUI only, Lite (keep user data), Full. We ask the agent to do
// the actual removal via `hermes uninstall …` so the cross-platform PATH /
// registry / service / node-symlink cleanup all lives in one place
// (hermes_cli/uninstall.py + hermes_cli/gui_uninstall.py).
//
// The IPC boundary applies the baked install policy before either callback.
// Only self-managed installs use the Python summary or the cleanup script.

function uninstallVenvPython(): string {
  return getVenvPython(VENV_ROOT)
}

function fallbackUninstallSummary(): UninstallSummaryDetails {
  return {
    hermes_home: HERMES_HOME,
    agent_installed: isHermesSourceRoot(ACTIVE_HERMES_ROOT) && fileExists(uninstallVenvPython()),
    gui_installed: true,
    source_built_artifacts: [],
    packaged_app_paths: [],
    userdata_dir: app.getPath('userData'),
    userdata_exists: true,
    platform: process.platform,
    probe: 'fallback'
  }
}

async function probeUninstallSummary(): Promise<UninstallSummaryDetails> {
  const py: string = uninstallVenvPython()
  const agentRoot: string = ACTIVE_HERMES_ROOT

  if (!fileExists(py)) {
    return fallbackUninstallSummary()
  }

  return new Promise<UninstallSummaryDetails>((resolve: (value: UninstallSummaryDetails) => void): void => {
    let stdout: string = ''
    let settled: boolean = false

    const done: (value: UninstallSummaryDetails) => void = (value: UninstallSummaryDetails): void => {
      if (settled) {
        return
      }

      settled = true
      resolve(value)
    }

    try {
      const child: ChildProcess = spawn(
        py,
        ['-m', 'hermes_cli.main', 'uninstall', '--gui-summary'],
        hiddenWindowsChildOptions({
          cwd: agentRoot,
          env: { ...process.env, HERMES_HOME, NO_COLOR: '1' },
          stdio: ['ignore', 'pipe', 'ignore']
        })
      )

      child.stdout.on('data', (chunk: Buffer): void => {
        stdout += chunk.toString()
      })
      child.on('error', (): void => done(fallbackUninstallSummary()))
      child.on('exit', (code: number | null): void => {
        if (code !== 0) {
          return done(fallbackUninstallSummary())
        }

        try {
          const line: string = stdout.trim().split('\n').filter(Boolean).pop() || '{}'
          const parsed: UninstallSummaryDetails = JSON.parse(line)
          // The app bundle the renderer would be removing on *this* machine,
          // resolved from the running exe (the Python probe only knows the
          // standard locations, not where THIS build actually runs from).
          parsed.running_app_path = resolveRemovableAppPath(process.execPath, process.platform, process.env)
          done(parsed)
        } catch {
          done(fallbackUninstallSummary())
        }
      })
      setTimeout((): void => done(fallbackUninstallSummary()), 8000)
    } catch {
      done(fallbackUninstallSummary())
    }
  })
}

async function runDesktopUninstall(mode: string): Promise<DesktopUninstallResult> {
  let uninstallArgs: string[]

  try {
    uninstallArgs = uninstallArgsForMode(mode)
  } catch (error) {
    return { ok: false, error: 'invalid-mode', message: error.message }
  }

  const venvPy = uninstallVenvPython()

  if (!fileExists(venvPy)) {
    return {
      ok: false,
      error: 'agent-missing',
      message: `Can't run the uninstaller: no Hermes agent venv at ${VENV_ROOT}.`
    }
  }

  // Interpreter choice (Finding 3): lite/full rmtree the venv that holds the
  // running python.exe. On Windows a running .exe is mandatory-locked, so the
  // rmtree must NOT be driven by the venv's own interpreter — use a system
  // Python with PYTHONPATH=<agentRoot> so `import hermes_cli` resolves from
  // source while the venv is torn down. gui-only doesn't touch the venv, so the
  // venv python is fine there. If no system Python exists (the Windows edge
  // case), fall back to the venv python — gui-only is unaffected; lite/full may
  // leave venv remnants the user can delete, which we log.
  let py = venvPy
  let pythonPath = null

  if (modeRemovesAgent(mode)) {
    const sysPy = await findSystemPython()

    if (sysPy) {
      py = sysPy
      pythonPath = ACTIVE_HERMES_ROOT
    } else if (IS_WINDOWS) {
      rememberLog(
        '[uninstall] no system Python found for lite/full on Windows; falling back ' +
          'to the venv python — venv files locked by the running interpreter may ' +
          'remain and need manual deletion.'
      )
    }
  }

  const appPath = resolveRemovableAppPath(process.execPath, process.platform, process.env)
  const removeBundle = shouldRemoveAppBundle(IS_PACKAGED, appPath) ? appPath : null

  // CRITICAL (Windows): tear down every backend the desktop owns and wait for
  // the venv shim to unlock BEFORE the cleanup script runs. lite/full delete
  // the venv, and even gui-only removes the install tree's GUI artifacts — a
  // live backend grandchild (gateway / pty / REPL) holding a mandatory file
  // lock would make the script's rmdir half-fail (#37532 for the update path).
  // Reuses the incident-hardened update teardown; no-op on macOS/Linux.
  try {
    await releaseBackendLock(ACTIVE_HERMES_ROOT, 'uninstall')
  } catch (error) {
    rememberLog(`[uninstall] backend teardown errored (continuing): ${error.message}`)
  }

  const scriptArgs = {
    desktopPid: process.pid,
    pythonExe: py,
    pythonPath,
    agentRoot: ACTIVE_HERMES_ROOT,
    uninstallArgs,
    appPath: removeBundle,
    hermesHome: HERMES_HOME
  }

  let scriptPath
  let runner
  let runnerArgs

  try {
    if (IS_WINDOWS) {
      scriptPath = path.join(app.getPath('temp'), `hermes-uninstall-${Date.now()}.cmd`)
      fs.writeFileSync(scriptPath, buildWindowsCleanupScript(scriptArgs))
      runner = process.env.ComSpec || 'cmd.exe'
      runnerArgs = ['/c', scriptPath]
    } else {
      scriptPath = path.join(app.getPath('temp'), `hermes-uninstall-${Date.now()}.sh`)
      fs.writeFileSync(scriptPath, buildPosixCleanupScript(scriptArgs), { mode: 0o755 })
      runner = '/bin/bash'
      runnerArgs = [scriptPath]
    }
  } catch (error) {
    return { ok: false, error: 'script-write-failed', message: error.message }
  }

  try {
    const child = spawn(runner, runnerArgs, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    })

    child.unref()
  } catch (error) {
    return { ok: false, error: 'spawn-failed', message: error.message }
  }

  rememberLog(
    `[uninstall] launched detached cleanup (${mode}): ${scriptPath} ` +
      `(removesAgent=${modeRemovesAgent(mode)} removesUserData=${modeRemovesUserData(mode)} bundle=${removeBundle || 'none'})`
  )

  // Give the renderer a beat to show its "uninstalling…" state, then quit so
  // the venv python shim + app bundle unlock and the cleanup script can run.
  isQuittingForHandoff = true
  setTimeout(() => app.quit(), 800)

  return { ok: true, mode, willRemoveAppBundle: Boolean(removeBundle), scriptPath }
}

registerDesktopUninstallIpc({
  ipcMain,
  stamp: INSTALL_STAMP,
  fallbackSummary: fallbackUninstallSummary,
  probeSummary: probeUninstallSummary,
  runUninstall: runDesktopUninstall
})

// Download a VS Code Marketplace extension and return the raw color-theme JSON
// it contributes. No theme code is executed — we only read JSON from the .vsix.
ipcMain.handle('hermes:vscode-theme:fetch', async (_event, id) => fetchMarketplaceThemes(String(id || '')))

// Search the Marketplace for color-theme extensions (empty query = top installs).
ipcMain.handle('hermes:vscode-theme:search', async (_event, query) => searchMarketplaceThemes(String(query || ''), 20))

// ---------------------------------------------------------------------------
// hermes:// deep links (e.g. hermes://blueprint/morning-brief?time=08:00,
// hermes://mcp/install?name=NAME&config=B64 — the vendor "Add to Hermes"
// button, or hermes://plugin/install?repo=owner/repo). Dev
// (`HERMES_DESKTOP_DEV_SERVER`) registers hermes-dev:// instead — bare
// Electron or a stale OS handler often owns hermes:// on dev machines.
// Parsing is generic ({kind, name, params}); the renderer routes per kind
// and anything install-shaped requires explicit user confirmation there.
// A docs/dashboard "Send to App" button opens this URL; we route it into the
// running app. Three delivery paths: macOS 'open-url',
// Win/Linux running-app 'second-instance' (argv), Win/Linux cold-start argv.
// ---------------------------------------------------------------------------
const HERMES_PROTOCOL = DEV_SERVER ? 'hermes-dev' : 'hermes'
/** Schemes accepted when parsing inbound URLs (dev accepts both). */
const DEEPLINK_SCHEMES = DEV_SERVER ? ['hermes-dev', 'hermes'] : ['hermes']
let _pendingDeepLink = null
let _rendererReadyForDeepLink = false
// Set by sendOpenUpdatesRequested() when the renderer cannot hear it yet.
let _pendingOpenUpdates = false

function _extractDeepLink(argv) {
  if (!Array.isArray(argv)) {
    return null
  }

  return argv.find(a => typeof a === 'string' && DEEPLINK_SCHEMES.some(s => a.startsWith(`${s}://`))) || null
}

function handleDeepLink(url) {
  if (!url || typeof url !== 'string') {
    return
  }

  let parsed

  try {
    parsed = new URL(url)
  } catch {
    rememberLog(`[deeplink] ignoring malformed url: ${url}`)

    return
  }

  const scheme = parsed.protocol.replace(/:$/, '')

  if (!DEEPLINK_SCHEMES.includes(scheme)) {
    rememberLog(`[deeplink] ignoring scheme ${scheme} (expected ${DEEPLINK_SCHEMES.join(' or ')})`)

    return
  }

  // hermes://blueprint/<key>?slot=val  -> host="blueprint", path="/<key>"
  const kind = parsed.hostname || ''
  const name = decodeURIComponent((parsed.pathname || '').replace(/^\//, ''))
  const params = {}
  parsed.searchParams.forEach((v, k) => {
    params[k] = v
  })
  const payload = { kind, name, params }

  // Route the Windows Copilot hardware key (registered by the MSIX
  // copilotkeyprovider fragment). quick-entry is the eventual summon; for
  // now it falls through to the renderer's deep-link listener. stop and
  // unknown copilot-key paths are activation noise and must not reach the
  // renderer (a tap fires start+stop nearly together; acting on stop would
  // undo the summon).
  if (kind === 'copilot-key' && name !== 'start') {
    rememberLog(`[deeplink] ignoring copilot-key path: ${name}`)

    return
  }

  // hermes://close-preview — the out-of-band exit hatch for a preview pane
  // that fullscreened itself and now owns all input (#97213). Handled here
  // rather than in the renderer because the whole point is to work when the
  // renderer cannot hear anything: exit the fullscreen window and close the
  // pane from the main process.
  if (kind === 'close-preview') {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()

      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false)
      }

      sendClosePreviewRequested()
    }

    return
  }

  if (!_rendererReadyForDeepLink || !mainWindow || mainWindow.isDestroyed()) {
    _pendingDeepLink = payload

    return
  }

  try {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    // #83998: a deep link must deliver without re-pumping the Windows
    // foreground when the window already has focus.
    if (shouldFocusToTakeKeyboard(mainWindow)) {
      mainWindow.focus()
    }

    mainWindow.webContents.send('hermes:deep-link', payload)
    rememberLog(`[deeplink] delivered ${kind}/${name}`)
  } catch (err) {
    rememberLog(`[deeplink] delivery failed: ${err.message}`)
  }
}

// Renderer calls this (via IPC) once it has mounted its deep-link listener, so
// a link that arrived during boot/install is flushed exactly once.
ipcMain.handle('hermes:deep-link-ready', () => {
  _rendererReadyForDeepLink = true

  if (_pendingOpenUpdates) {
    _pendingOpenUpdates = false
    sendOpenUpdatesRequested()
  }

  if (_pendingDeepLink) {
    const queued = _pendingDeepLink
    _pendingDeepLink = null
    handleDeepLink(
      `${HERMES_PROTOCOL}://${queued.kind}/${encodeURIComponent(queued.name)}` +
        (Object.keys(queued.params).length ? '?' + new URLSearchParams(queued.params).toString() : '')
    )
  }

  return { ok: true }
})

function registerDeepLinkProtocol() {
  try {
    if (process.defaultApp && process.argv.length >= 2) {
      // Dev: register with the electron exec path + entry script so the OS can
      // relaunch us with the URL. argv[1] is usually "." when launched via
      // `electron .` from apps/desktop — resolve against cwd.
      const entry = path.resolve(process.argv[1])
      app.setAsDefaultProtocolClient(HERMES_PROTOCOL, process.execPath, [entry])
    } else {
      app.setAsDefaultProtocolClient(HERMES_PROTOCOL)
    }

    rememberLog(`[deeplink] registered ${HERMES_PROTOCOL}:// handler`)
  } catch (err) {
    rememberLog(`[deeplink] protocol registration failed: ${err.message}`)
  }
}

// macOS: register the deep link before the lock. Launch Services relaunches
// the app when the default protocol client changes; if the lock is already
// held, that relaunch flashes a second Dock icon and then app.exit(0)s.
// Win/Linux have no Dock and still register on ready.
const preReadyDockSteps = preReadyDockLaunchSteps(process.platform)

if (preReadyDockSteps.includes('register-deep-link')) {
  registerDeepLinkProtocol()
}

// Single-instance lock: deep links on a running app (Win/Linux) arrive as a
// second-instance argv. Without the lock a second `hermes://` launch spawns a
// whole new app instead of routing into the running one.
if (!isPrimaryInstance) {
  // Hard-exit, not app.quit(): the before-quit teardown coordinator defers a
  // plain quit (event.preventDefault + async backend shutdown), and in that
  // window `ready` still fires — the lock-losing instance then runs the full
  // startup (shortcut registration, createWindow → startHermes), whose
  // reapOrphans() SIGTERMs the running instance's live backend (#87295).
  // app.exit() terminates immediately, before `ready`, so a second launch
  // routes into the running window and never touches backend machinery.
  app.exit(0)
} else {
  // Cold-start --profile must win over the stored preference before
  // startHermes() reads active-profile.json. Only the instance that will
  // boot writes: a second launch must not retarget the running app. A missing
  // or invalid flag is a no-op, so the stored profile stays.
  try {
    applyLaunchProfileOverride(process.argv, name => {
      writeActiveDesktopProfile(name)
    })
  } catch (error) {
    console.error('[hermes] failed to persist --profile launch override:', error)
  }

  app.on('second-instance', (_event, argv) => {
    // --close-preview: the same escape hatch as hermes://close-preview, for
    // environments where spawning a URL is harder than a flag (kiosk launchers,
    // SSH-started sessions). Checked before deep links so a carried `hermes://`
    // URL still routes normally when no flag is present.
    if (hasClosePreviewFlag(argv)) {
      handleDeepLink('hermes://close-preview')
    }

    const url = _extractDeepLink(argv)

    if (url) {
      handleDeepLink(url)
    }

    ensureMainWindow(mainWindow, {
      isReady: app.isReady(),
      createWindow,
      focusWindow,
      // deep-link delivery focuses a live window after its renderer is ready.
      focusExisting: !url
    })
  })
}

// macOS delivers deep links via 'open-url' — register early (can fire before
// whenReady; handleDeepLink queues until the renderer is ready).
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleDeepLink(url)
})

app.whenReady().then(async () => {
  // Serve the packaged renderer over loopback HTTP (real origin for embeds —
  // see renderer-server.ts) before any window loads it. In dev the Vite dev
  // server already provides the origin.
  if (!DEV_SERVER) {
    packagedRendererServer = await startRendererServer(path.dirname(resolveRendererIndex()))
  }

  // Post-update relaunch detection (App Installer arm): when the previous
  // version wrote the one-shot pending-relaunch marker before quitting into
  // an OS package swap, consume it here — the renderer toasts "Hermes
  // updated to vX.Y.Z" once its bridge is up. Same-version markers (update
  // never landed) are deleted silently.
  const relaunchInfo: ConsumedRelaunch = consumePendingRelaunch(app, app.getVersion())

  if (relaunchInfo.wasUpdateRelaunch) {
    rememberLog(`[updates] post-update relaunch detected (from ${relaunchInfo.fromVersion})`)
  }

  // Warm the login-shell PATH resolution immediately so it usually completes
  // before the backend start path awaits the same single-flight promise.
  void ensureLoginShellPath()

  if (CRASH_DIAGNOSTICS) {
    startChromiumLogWatcher(CHROMIUM_LOG_PATH)
  }

  const systemCa = installSystemCaTrust(tls)

  if (systemCa.applied) {
    rememberLog(`[tls] trusting ${systemCa.systemCertificateCount} OS CA certificate(s) for backend connections`)
  } else if (systemCa.error) {
    rememberLog(`[tls] could not load OS system CA certificates: ${systemCa.error}`)
  }

  // Keyring-less Linux `--password-store=basic` support. This must run before
  // createWindow() and anything that could touch safeStorage; the narrow
  // platform/switch/guard semantics live in the extracted helper.
  enableBasicPasswordStoreEncryption({
    platform: process.platform,
    passwordStoreSwitch: app.commandLine.getSwitchValue('password-store'),
    safeStorageApi: safeStorage
  })

  // Keychain encryption is opt-in (default OFF). One-shot: rewrite any
  // legacy safeStorage-encrypted secrets as plain so no later launch ever
  // touches the OS keychain unless the user turns encryption on in
  // Settings → Gateway. Must run before createWindow() and the first
  // connection resolution.
  migrateLegacyEncryptedSecretsOnce()

  // Expose the renderer's accessibility tree to the OS (#118271, Windows
  // twin #92607): dictation tools that insert text through the accessibility
  // APIs don't register as screen readers, so Chromium never builds the tree
  // and the composer stays invisible to them. Must run after `ready` (the
  // API's requirement). Opt out with desktop.renderer_accessibility: false
  // (bridged as HERMES_DESKTOP_RENDERER_ACCESSIBILITY=0); the platform/env
  // decision lives in the extracted helper.
  enableRendererAccessibility({ appApi: app })

  installMediaPermissions()
  installDownloadHandling()
  registerMediaProtocol()
  installEmbedReferer()
  installRemoteHeaderRules()

  if (!preReadyDockSteps.includes('register-deep-link')) {
    registerDeepLinkProtocol()
  }

  installPreviewGuestEscapeHatch()
  installPreviewGuestPreload()

  ensureWslWindowsFonts()
  configureSpellChecker()
  registerPowerResumeListeners()
  keepAwake.set(readPersistedKeepAwake())
  void minimizeToTray.start()
  mainProcessLagWatchdog.start()
  f12Blocked = readPersistedDisableF12()
  // Seed this before the first window exists: a picker can open before
  // startHermes() finishes resolving the configured backend.
  const primaryProfile = primaryProfileKey()

  setActiveGatewayProfile(primaryProfile)
  setWslBridgeProfileState(primaryProfile, !primaryBackendIsRemote())
  // Quick Entry's global chord — registered on ready so a cold launch restores
  // it without the renderer visiting Settings. A failed registration is logged
  // here and surfaced in Settings via the IPC state (never silent).
  applyQuickEntrySettings(readQuickEntrySettings())
  installCommandScreenshot({ rendererUrl: rendererBaseUrl() })
  installHudModifierTap({
    rendererUrl: rendererBaseUrl(),
    summon: () => {
      if (!isQuittingForHandoff && !backendShutdown.hasStarted()) {
        openHudWindow(null, null)
      }
    }
  })

  if (IS_MAC) {
    const reposition = () => wakeIndicatorController.reposition()

    screen.on('display-added', reposition)

    screen.on('display-metrics-changed', reposition)

    screen.on('display-removed', reposition)
  }

  // Mixed-DPI display changes can drop DWM's chat backdrop (#106285).
  installTranslucencyReassertOnDisplayMetrics(screen, () => {
    for (const win of BrowserWindow.getAllWindows()) {
      if (translucencyBackedWindows.has(win)) {
        reassertChatWindowTranslucencyForDpi(win)
      }
    }
  })

  // The popped-out pet must never be stranded on a disconnected display: when
  // the topology changes, pull an off-screen overlay back onto the display
  // that holds the main window (and persist the corrected spot). Unlike the
  // wake indicator this applies on every platform — the pet overlay exists
  // everywhere, and rehomePetOverlay is a cheap no-op while the pet is in the
  // window or still on-screen.
  screen.on('display-added', rehomePetOverlay)

  screen.on('display-metrics-changed', rehomePetOverlay)

  screen.on('display-removed', rehomePetOverlay)

  // A hard crash can interrupt the in-memory restore loop after exact remote
  // serves were drained. The owner-only recovery journal survives that crash;
  // its worker waits for the install marker to clear, then reopens every scope
  // captured by the original transaction before removing the journal entry.
  void resumeManagedSshRecoveries()
  installApplicationMenuAfterFirstWindow({
    isMac: IS_MAC,
    buildMenu: buildApplicationMenu,
    setApplicationMenu: menu => Menu.setApplicationMenu(menu),
    createWindow
  })

  // Win/Linux cold start: the launching hermes:// URL is in our own argv.
  const _coldStartLink = _extractDeepLink(process.argv)

  if (_coldStartLink) {
    handleDeepLink(_coldStartLink)
  }

  app.on('activate', () => {
    // Recreate the primary window if it's gone. Guard on mainWindow directly
    // (not just total window count) so a dock click still restores the main
    // window when only secondary session windows remain open.
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow()
    } else {
      focusWindow(mainWindow)
    }
  })
})

// Seed Chromium's spellchecker with the system locale (falling back to en-US).
// On macOS Electron uses the native spellchecker which ignores this list, but
// on Windows/Linux Chromium downloads Hunspell dictionaries on demand and
// won't enable any without an explicit language.
function configureSpellChecker() {
  try {
    const defaultSession = session.defaultSession

    if (!defaultSession || typeof defaultSession.setSpellCheckerLanguages !== 'function') {
      return
    }

    const available = defaultSession.availableSpellCheckerLanguages || []
    const locale = (app.getLocale && app.getLocale()) || 'en-US'
    const candidates = [locale, locale.split('-')[0], 'en-US', 'en']
    const chosen = candidates.find(lang => available.includes(lang)) || 'en-US'

    defaultSession.setSpellCheckerLanguages([chosen])
  } catch (error) {
    rememberLog(`Spellchecker setup failed: ${error.message}`)
  }
}

// Does quitting take the agent down with the app? Reads the primary profile's
// route through the same resolver resolveRemoteBackend uses, plus every backend
// the quit teardown below will stop (spawned children, SSH-managed servers).
// A route we can't resolve counts as owned: the lost-work warning is the safe
// side to be wrong on.
function quitStopsBackendWork(): boolean {
  let primaryRouteKind: 'cloud' | 'remote' | 'ssh' | null

  try {
    primaryRouteKind =
      resolveDesktopRemoteRoute({
        config: readDesktopConnectionConfig(),
        env: {
          token: process.env.HERMES_DESKTOP_REMOTE_TOKEN,
          url: process.env.HERMES_DESKTOP_REMOTE_URL
        },
        profile: primaryProfileKey(),
        registry: readDesktopConnectionsRegistry()
      })?.kind ?? null
  } catch {
    return true
  }

  const ownedBackendCount =
    (backendConnectionState.getProcess() ? 1 : 0) +
    [...backendPool.values()].filter(entry => entry?.process).length +
    sshConnections.size

  return backendOwnedByApp({ ownedBackendCount, primaryRouteKind })
}

// Ask before a quit kills a turn in flight. True when the quit was intercepted
// and the confirmation is on screen; the confirm button re-enters before-quit with
// the latch set and falls straight through to the teardown below.
function heldQuitForActiveWork(event: Electron.Event): boolean {
  if (SKIP_QUIT_CONFIRM || quitConfirmedWithActiveWork || isQuittingForHandoff) {
    return false
  }

  if (quitPromptOpen) {
    event.preventDefault()

    return true
  }

  // The per-webContents map can read empty at quit time even though a turn
  // is live (a stream can reload its webContents mid-turn, dropping the entry
  // before the guard runs), so merge in the last summary any renderer sent.
  const work = mergeActiveWork([...activeWorkByWebContents.values(), lastActiveWorkSeen])

  const prompt = quitPromptFor(work, isQuittingForHandoff, quitStopsBackendWork())

  // A tray quit with live work still needs the ordinary visible confirmation.
  if (prompt && minimizeToTray.status().available) {
    minimizeToTray.restore()
  }

  // A hidden aux window must never parent the quit prompt: the dialog would
  // be invisible and the held quit unanswerable (#116376 §E).
  const parent = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows().find(window => window.isVisible())

  if (!prompt || !parent || parent.isDestroyed()) {
    return false
  }

  event.preventDefault()
  quitPromptOpen = true

  void dialog
    .showMessageBox(parent, {
      buttons: [...prompt.buttons],
      cancelId: 0,
      defaultId: 0,
      detail: prompt.detail,
      message: prompt.message,
      type: 'question'
    })
    .then(({ response }) => {
      quitPromptOpen = false

      if (response === 1) {
        quitConfirmedWithActiveWork = true
        app.quit()
      }
    })
    .catch(() => {
      // A dialog we can't show must not become a quit we can't perform.
      quitPromptOpen = false
      quitConfirmedWithActiveWork = true
      app.quit()
    })

  return true
}

// Intercept the close of the LAST chat window while the window and its
// active-work report are still alive. On Windows/Linux the primary quit
// gesture is the title-bar close button: closing the final window destroys
// its webContents (clearing the active-work map) BEFORE window-all-closed
// reactively calls app.quit() — by the time before-quit runs, heldQuitForActiveWork
// finds nothing and the app exits silently (#96139). Running the same guard
// here, on the close event itself, catches it in time; "Quit Anyway" re-enters
// before-quit with the latch set and falls through.
function registerChatWindow(window: BrowserWindow) {
  chatWindows.add(window)
  window.on('close', (event: Electron.Event) => {
    // The tray's close-to-tray handler runs first (registered first) and
    // absorbs the close into a hide — the work keeps running, so there is
    // nothing to confirm.
    if (event.defaultPrevented) {
      return
    }

    const work = mergeActiveWork(activeWorkByWebContents.values())

    if (!shouldGuardWindowClose(work, isQuittingForHandoff, IS_MAC, hasOtherChatWindows(window))) {
      return
    }

    heldQuitForActiveWork(event)
  })
  window.once('closed', () => chatWindows.delete(window))
}

app.on('before-quit', event => {
  // Latch first, before ANY teardown below closes the pet overlay: its
  // 'closed' handler must not echo pop-in during quit, or the persisted
  // popped-out state is wiped and the overlay never restores (#55920).
  appQuitting = true

  // Runs ahead of every teardown below, so "Keep Running" leaves the app
  // exactly as it was.
  if (heldQuitForActiveWork(event)) {
    return
  }

  minimizeToTray.beginQuit()
  mainProcessLagWatchdog.stop()

  // A detached remote updater can outlive this Electron process. Do not tear
  // down its SSH observer/restore transaction at the generic SSH shutdown
  // deadline: join it first (BEFORE sealing the bootstrap coordinator, whose
  // shutdown would refuse the restore dials), then re-enter before-quit for
  // normal teardown. A crash still fails closed on next launch via the remote
  // install-marker preflight in both POSIX and Windows lifecycle
  // implementations.
  if (
    !managedUpdateQuitWaitDone &&
    (managedUpdateQuitWait || managedConnectionUpdates.size > 0 || managedConnectionRecoveries.size > 0)
  ) {
    event.preventDefault()

    if (!managedUpdateQuitWait) {
      managedUpdateQuitWait = waitForManagedUpdateOperations(() => [
        ...managedConnectionUpdates.values(),
        ...managedConnectionRecoveries.values()
      ]).finally(() => {
        managedUpdateQuitWaitDone = true
        app.quit()
      })
    }

    return
  }

  // A prevented first quit leaves the renderer alive while teardown runs.
  // Seal the SSH coordinator before touching connections so reconnect
  // callbacks cannot recreate a backend for a registration whose app is
  // already quitting (#91668).
  sshBootstrapCoordinator.shutdown()

  const backendNeedsWait = backendQuitNeedsWait({
    connectionPending: backendConnectionState.getPendingPromise() !== null || localBackendLifecycle.hasPending(),
    poolPending: poolStopper.hasPending(),
    processAttached: backendConnectionState.getProcess() !== null,
    shutdownPending: backendShutdown.isPending()
  })

  const sshNeedsWait =
    sshConnections.size > 0 || sshBootstrapCoordinator.promises().length > 0 || sshTeardowns.hasPending()

  const teardownTasks: QuitTeardownTask[] = [
    { run: (): Promise<void> => backendShutdown.run(), waitForCompletion: backendNeedsWait }
  ]

  if (sshNeedsWait) {
    teardownTasks.push({ run: teardownSshForQuit, waitForCompletion: true })
  }

  if (quitTeardown.begin(teardownTasks)) {
    event.preventDefault()
  }

  // Clean quit mid-boot should not trip next-launch --no-sandbox (#38216).
  // FATAL GPU aborts skip before-quit, leaving the `booting` marker in place.
  // Keyed on sticky (not active): a manual --no-sandbox run still records a
  // clean quit, while an engaged fallback keeps its sticky marker.
  if ((IS_WINDOWS || process.platform === 'linux') && !windowsSandboxFallbackSticky) {
    try {
      writeSandboxMarker(app.getPath('userData'), markerAfterSuccessfulBoot({ fallbackActive: false }))
    } catch {
      void 0
    }
  }

  // #124843: a clean quit mid-boot must not trip next-launch --disable-gpu.
  // Keyed on sticky (not active) so an engaged fallback keeps its marker.
  if (process.platform === 'linux' && !linuxGpuFallbackSticky) {
    try {
      writeLinuxGpuMarker(app.getPath('userData'), linuxGpuMarkerAfterSuccessfulBoot({ fallbackActive: false }))
    } catch {
      void 0
    }
  }

  // The always-on-top overlay isn't a "real" app window; close it so a stray
  // pet can't keep the process alive or float over a quit app.
  closePetOverlay()
  wakeIndicatorController.close()

  // Same for the HUD — an always-on-top panel outliving the app would leave a
  // floating composer with nothing behind it. Close it directly rather than via
  // closeHudWindow(): that also re-shows the main window, which is wrong on the
  // way out (and `hudRestoreMainWindow` may still be armed from entering HUD).
  hudSnapShortcut.dispose()

  if (hudWindow && !hudWindow.isDestroyed()) {
    hudWindow.removeAllListeners('closed')
    hudWindow.destroy()
  }

  hudWindow = null

  void packagedRendererServer?.close()

  // Same for the Quick Entry composer — and release its global accelerator so a
  // quitting Hermes never keeps another app's chord hostage.
  closeQuickEntryWindow()

  // Quitting mid-install should stop the installer, not orphan it.
  if (bootstrapAbortController) {
    try {
      bootstrapAbortController.abort()
    } catch {
      void 0
    }
  }

  if (desktopLogFlushTimer) {
    clearTimeout(desktopLogFlushTimer)
    desktopLogFlushTimer = null
  }

  flushDesktopLogBufferSync()
  closePreviewWatchers()

  // Kill open PTYs before environment teardown to avoid the node-pty#904
  // ThreadSafeFunction SIGABRT race.
  terminalIpc.disposeAllTerminalSessions()

  void backendShutdown.run()
})

app.on('window-all-closed', () => {
  // macOS convention: keep the process alive in the Dock when the user closes
  // the last window. But when we're handing off to a detached updater / swap /
  // uninstall script, the process MUST exit so the script can replace or remove
  // the bundle and relaunch — without this the script's PID-wait spins to its
  // full timeout and the user is left with an invisible app (or an uninstall
  // that appears to do nothing).
  if (process.platform !== 'darwin' || isQuittingForHandoff) {
    app.quit()
  }
})
