Warning: truncated output (original token count: 63219)
Total output lines: 4316

import { defineFieldCopy } from '@/app/settings/field-copy'

import { defineLocale } from './define-locale'
import { introJa } from './intro-ja'

export const ja = defineLocale({
  externalOpenFailed: {
    title: 'このリンクを開けませんでした',
    message: 'このアドレスを開くブラウザが登録されていません。リンクをコピーして手動で開いてください。',
    copyUrl: 'リンクをコピー',
    close: '閉じる'
  },
  sharedMetrics: {
    consentTitle: 'Hermes の改善に協力しますか？',
    consentBody:
      '共有メトリクスは上限付きのカウンターだけです。プロンプト、ファイル、パス、エラーテキストは含みません。収集はローカルで行われ、Nous への送信は別途オプトインです。',
    whatIsCollected: '収集される内容',
    collectedIntro: '上限付きのカウンターのみ：',
    collectedActivity: 'アクティビティ、セッションの長さ、結果、エラーの分類',
    collectedModels: 'モデルのルートとトークン合計',
    collectedNames: '組み込みツール、コマンド、カタログの名前',
    collectedMilestones: '区分けされたセットアップの件数',
    collectedReliability:
      'アップデートの結果と所要時間、クラッシュ、起動と応答の速さ、メッセージングプラットフォームの状態',
    collectedUsage:
      'Hermes の使われ方：エージェントの精度と効率（編集の適用結果、ループ、エラーからの回復、タスクごとのトークン数とツール呼び出し数、キャッシュの破棄）、画面・Desktop モードごとのアクティブ時間、アプリのどの領域・操作・設定が使われ、すぐ閉じられ、オフにされたか、プロバイダー設定の結果',
    collectedMachine:
      '大まかなマシン情報：RAM の範囲、GPU の種類、Hermes バージョンの古さとリリースチャネル、未適用の更新数、ローカルモデルサーバーの使用有無',
    installId:
      '送信すると、日次パッケージが Nous のテレメトリサービスにアップロードされます。パッケージにはこのプロファイルのインストール ID（個人情報を含まない固定のランダム UUID。共有メトリクスのディレクトリを削除するとリセット）が付きます。',
    consentWindow:
      '収集期間全体が記録済みの同意期間内に収まるパッケージだけが送信されます。オプトイン前のデータや、送信オフ中のデータはこのマシンに残ります。送信はいつでもオフに戻せます。',
    readDocs: '詳細を読む',
    share: '収集して Nous に送信する',
    local: 'ローカルでのみ収集する',
    off: '共有しない',
    changeLater: '設定 → 安全性 からいつでも変更できます。',
    saveFailed: '選択を保存できませんでした',
    collectLabel: '利用統計を収集する',
    collectDesc:
      '上限付きのカウンターをこのデバイスに保存します。プロンプト、ファイル、パス、エラーテキストは含みません。',
    sendLabel: '利用統計を Nous に送信する',
    sendDesc:
      '日次パッケージを Nous のテレメトリサービスにアップロードします。同意期間内のデータだけが送信されます。収集がオンである必要があります。',
    unavailable: 'この設定を変更するには Hermes バックエンドを更新してください。',
    stripBody: '上限付きのカウンターのみ。プロンプトやファイルは含みません。',
    stripChoices: { share: 'Nous に送信', local: 'ローカルのみ', off: '今はしない' },
    stripDetails: '詳細'
  },
  intro: introJa,
  catalog: {
    add: '追加',
    added: '追加済み',
    discover: '見つける',
    featured: 'おすすめ',
    explorePlugins: 'プラグインを探す',
    exploreSkills: 'スキルを探す',
    mostStarred: 'スターが多い順',
    newest: '新着',
    recentlyUpdated: '最近の更新',
    alphabetical: '名前',
    sortBy: '並べ替え',
    seeAll: 'すべて表示',
    related: '類似の項目',
    tags: 'タグ',
    screenshots: 'スクリーンショット',
    listView: 'リスト表示',
    cardView: 'カード表示',
    installTitle: (name: string) => `「${name}」をインストールしますか？`,
    installDescription:
      'このスキルは新しいセッションで利用できます。信頼できる提供元からのみインストールしてください。',
    installTo: 'インストール先',
    thisComputer: 'このコンピューター',
    installing: 'インストール中…',
    installComplete: (name: string) => `「${name}」をインストールしました`,
    destinationChanged:
      'インストール先が変更されました。このダイアログを閉じ、インストールリンクを開き直してください。',
    installed: 'インストール済み',
    searchSkills: 'スキルを検索',
    searchPlugins: 'プラグインを検索',
    allSources: 'すべての提供元',
    allCategories: 'すべてのカテゴリ',
    about: '概要',
    author: '作者',
    source: '提供元',
    category: 'カテゴリ',
    version: 'バージョン',
    platforms: '対応プラットフォーム',
    requires: '必要なもの',
    tools: 'ツール',
    hooks: 'フック',
    middleware: 'ミドルウェア',
    commands: 'コマンド',
    license: 'ライセンス',
    addedDate: '追加日',
    updatedDate: '更新日',
    repository: 'リポジトリ',
    documentation: 'ドキュメント',
    noResults: '一致する項目がありません',
    tryAnother: '別の検索を試すか、フィルターをクリアしてください。',
    clearFilters: 'フィルターをクリア',
    filters: 'フィルター',
    loadFailed: 'カタログを読み込めませんでした',
    retry: '再試行',
    more: 'さらに表示',
    pinned: 'レビュー済みコミット',
    snapshotHint: 'Hermesカタログの情報です。閲覧時に提供元のリポジトリへ接続することはありません。',
    installHint: 'インストール前にソースを確認してください。変更は新しいセッションに適用されます。',
    results: (count: number) => `${count.toLocaleString('ja')}件の結果`,
    back: '結果に戻る'
  },
  sessionImport: {
    title: '別のアプリから続ける',
    subtitle: '会話をHermesに取り込み、続きを始めましょう。',
    action: 'セッションを取り込む',
    readingFrom: '読み込み元',
    connectedComputer: '接続先のコンピューター',
    destination: '取り込み先',
    all: 'すべて',
    search: '読み込み済みのセッションを検索',
    scanning: '会話を検索中',
    scanError: 'セッションを取得できません',
    scanHelp: 'バックエンドの接続を確認して再試行してください。古いバックエンドは更新が必要な場合があります。',
    empty: '会話が見つかりません',
    emptyHelp: 'このバックエンドのClaude CodeとCodexのセッションがここに表示されます。',
    noMatches: '一致する会話がありません',
    searchHelp: '別のタイトルやフォルダーを検索するか、セッションを追加で読み込んでください。',
    skipped: '空、読み込み不可、または大きすぎるログをスキップしました。',
    more: 'さらに読み込む',
    messages: 'メッセージ',
    choose: '会話の続きを始めましょう',
    chooseHelp: 'セッションを選び、取り込む前に履歴を確認できます。',
    previewLoading: 'プレビューを開いています',
    previewError: 'プレビューできません',
    previewHelp: '元のファイルが移動または変更された可能性があります。一覧を更新してください。',
    previewLimit: '読みやすいようにプレビューを省略しています。取り込み時は会話全体をコピーします。',
    you: 'あなた',
    snapshot: 'この会話は取り込み済みです。既存のコピーを開いて続けられます。',
    copyNotice: '会話のテキストをコピーします。元のファイルは変更されません。ツール出力と推論は含まれません。',
    importing: '取り込み中…',
    open: 'Hermesで開く',
    continue: 'Hermesで続ける',
    importError: '会話を取り込めませんでした。'
  },
  common: {
    apply: '適用',
    back: '戻る',
    save: '保存',
    saving: '保存中…',
    cancel: 'キャンセル',
    change: '変更',
    choose: '選択',
    clear: 'クリア',
    close: '閉じる',
    collapse: '折りたたむ',
    confirm: '確認',
    connect: '接続',
    connecting: '接続中',
    continue: '続ける',
    bots: 'ボット',
    copied: 'コピーしました',
    copy: 'コピー',
    copyFailed: 'コピーに失敗しました',
    delete: '削除',
    docs: 'ドキュメント',
    done: '完了',
    error: 'エラー',
    expand: '展開',
    failed: '失敗',
    formatJson: 'JSON を整形',
    free: '無料',
    loading: '読み込み中…',
    notSet: '未設定',
    refresh: '更新',
    remove: '削除',
    replace: '置き換え',
    retry: '再試行',
    run: '実行',
    send: '送信',
    set: '設定',
    skip: 'スキップ',
    update: '更新',
    tryHint: term => `「${term}」を試す`,
    on: 'オン',
    off: 'オフ'
  },

  fileMenu: {
    revealFinder: 'Finder で表示',
    revealExplorer: 'エクスプローラーで表示',
    revealFileManager: '格納フォルダーを開く',
    revealInSidebar: 'ファイルツリーで表示',
    copyPath: 'パスをコピー',
    copyRelativePath: '相対パスをコピー',
    download: 'ダウンロード',
    downloadSaved: '保存しました',
    downloadFailed: 'ダウンロードに失敗しました',
    rename: '名前を変更…',
    delete: '削除',
    renameTitle: '名前を変更',
    renameLabel: '新しい名前',
    deleteTitle: name => `${name} を削除しますか？`,
    deleteBody: 'ゴミ箱に移動します。そこから復元できます。',
    pathCopied: 'パスをコピーしました',
    revealMissing: 'そのフォルダーはこのコンピューターにありません'
  },

  boot: {
    ready: 'Hermes Desktop の準備ができました',
    desktopBootFailedWithMessage: message => `デスクトップの起動に失敗しました: ${message}`,
    steps: {
      connectingGateway: 'ライブデスクトップゲートウェイに接続中',
      loadingSettings: 'Hermes の設定を読み込み中',
      loadingSessions: '最近のセッションを読み込み中',
      retryingRemoteBackend: 'リモート Hermes バックエンドに再接続中…',
      startingDesktopConnection: 'デスクトップ接続を開始中',
      startingHermesDesktop: 'Hermes Desktop を起動中…'
    },
    errors: {
      backgroundExited: 'Hermes バックグラウンドプロセスが終了しました。',
      backgroundExitedDuringStartup: '起動中に Hermes バックグラウンドプロセスが終了しました。',
      backendStopped: 'バックエンドが停止しました',
      desktopBootFailed: 'デスクトップの起動に失敗しました',
      gatewayConnectionLost: 'ゲートウェイへの接続が切断されました',
      gatewayConnectionLostDetail:
        'Still retrying in the background. You can keep reading and drafting — open Gateway settings if this persists.',
      gatewaySignInRequired: 'ゲートウェイへのサインインが必要です',
      ipcBridgeUnavailable: 'デスクトップ IPC ブリッジが利用できません。'
    },
    failure: {
      title: 'Hermes を起動できませんでした',
      description:
        'バックグラウンドゲートウェイが起動しませんでした。以下の回復手順をお試しください。チャットや設定は削除されません。',
      remoteTitle: 'リモートゲートウェイへのサインインが必要です',
      remoteDescription:
        'リモートゲートウェイのセッションが期限切れです。再接続するにはもう一度サインインしてください。チャットや設定は削除されません。',
      retry: '再試行',
      repairInstall: 'インストールを修復',
      useLocalGateway: 'ローカルゲートウェイを使用',
      gatewaySettings: 'ゲートウェイ設定',
      back: '戻る',
      openLogs: 'ログを開く',
      repairHint: '修復はインストーラーを再実行します。新しいマシンでは数分かかる場合があります。',
      remoteSignInHint: signInLabel =>
        `保存済みのリモートブラウザセッションからサインアウトし、${signInLabel}を開きます。代わりにバンドルされたバックエンドに切り替えるには「ローカルゲートウェイを使用」を選択してください。`,
      signOutAndSignIn: 'サインアウトして再サインイン',
      remoteFailureHint:
        '「ゲートウェイ設定」でゲートウェイの URL とサインインを確認するか、ローカルゲートウェイに切り替えてください。',
      cloudDownTitle: 'Nous Cloud エージェントが停止しています',
      cloudDownDescription:
        'このゲートウェイが接続している Nous 管理のクラウドエージェントがサーバーエラーを返しています。ここから再起動することはできません。ステータスを確認するか、ローカルゲートウェイに切り替えるか、サポートに連絡してください。',
      cloudDownHint:
        '下のボタンから Nous Portal（インスタンスの状態と操作）を開くか、Discord でサポートを受けられます。',
      cloudDownCheckPortal: 'Portal のステータスを確認',
      cloudDownDiscord: 'Discord でサポートを受ける',
      hideRecentLogs: '最近のログを非表示',
      showRecentLogs: '最近のログを表示',
      signedInTitle: 'サインインしました',
      signedInMessage: 'リモートゲートウェイに再接続中…',
      signInIncompleteTitle: 'サインインが完了していません',
      signInIncompleteMessage: '認証が完了する前にログインウィンドウが閉じられました。',
      signInFailed: 'サインインに失敗しました',
      signInToRemoteGateway: 'リモートゲートウェイにサインイン',
      signInWithProvider: provider => `${provider} でサインイン`,
      identityProvider: 'ID プロバイダー'
    }
  },

  notifications: {
    sharedProfileWarning:
      '別の Hermes インストールがこのプロファイルを使用しています。両方が設定とデータを共有しているため、変更が競合する可能性があります。このまま続けるか、変更する前にもう一方を終了してください。',
    region: '通知',
    hide: '非表示',
    show: '表示',
    more: count => `他 ${count} 件の通知`,
    clearAll: 'すべてクリア',
    dismiss: '通知を閉じる',
    details: '詳細',
    copyDetail: '詳細をコピー',
    copyDetailFailed: '通知の詳細をコピーできませんでした',
    backendOutOfDateTitle: 'バックエンドが古いです',
    backendOutOfDateMessage:
      'Hermes バックエンドがこのデスクトップビルドより古く、正常に動作しない場合があります。更新して揃えてください。',
    desktopOutOfDateTitle: 'アプリが古いです',
    desktopOutOfDateMessage:
      'この Hermes アプリは接続先のバックエンドより古く、正常に動作しない場合があります。アプリを更新して揃えてください。',
    updateDesktopApp: 'アプリを更新',
    installMethodUnsupportedTitle: 'サポート対象外のインストール方法',
    updateHermes: 'Hermes を更新',
    updateReadyTitle: '更新の準備ができました',
    updateReadyMessage: count => `${count} 件の新しい変更が利用可能です。`,
    updateReadyMessageUnknown: '新しい更新が利用可能です。',
    seeWhatsNew: '新機能を見る',
    mcp: {
      needsAuthTitle: 'MCP サーバーの再認証が必要です',
      needsAuthMessage: name => `${name} MCP の再認証が必要です。`,
      errorTitle: 'MCP サーバーに接続できません',
      errorMessage: name => `${name} MCP のヘルスチェックに失敗しました。`,
      signIn: 'サインイン',
      view: '表示',
      disable: '無効化',
      disabledMessage: name => `${name} MCP を無効にしました。機能 → MCP からいつでも再有効化できます。`,
      disableFailed: name => `${name} MCP を無効にできませんでした。`
    },
    errors: {
      elevenLabsNeedsKey: 'ElevenLabs STT には ELEVENLABS_API_KEY が必要です。',
      elevenLabsRejectedKey: 'ElevenLabs が API キーを拒否しました (401)。',
      diskFull: 'ディスク容量不足です — 空きを作ってからもう一度お試しください。',
      gatewayAuthFailed: 'ゲートウェイ認証に失敗しました — API_SERVER_KEY を確認してください。',
      methodNotAllowed:
        'デスクトップバックエンドがそのリクエストを拒否しました (405 Method Not Allowed)。Hermes Desktop を再起動してください。',
      microphonePermission: 'マイクのアクセス許可が拒否されました。',
      openaiRejectedApiKey: 'OpenAI が API キーを拒否しました。',
      openaiTtsNeedsKey: 'OpenAI TTS には VOICE_TOOLS_OPENAI_KEY または OPENAI_API_KEY が必要です。',
      codeSkewRestartRequired:
        'アップデート後、このバックエンドは古いコードのままです。再起動して新しいコードを読み込んでください。'
    },
    voice: {
      configureSpeechToText: '音声モードを使用するには音声認識を設定してください。',
      couldNotStartSession: '音声セッションを開始できませんでした',
      microphoneAccessDenied: 'マイクへのアクセスが拒否されました。',
      microphoneConstraintsUnsupported: 'このデバイスはマイクの制約をサポートしていません。',
      microphoneFailed: 'マイクが失敗しました',
      microphoneInUse: 'マイクは他のアプリで使用中です。',
      microphonePermissionDenied: 'マイクのアクセス許可が拒否されました。',
      microphoneStartFailed: 'マイクの録音を開始できませんでした。',
      microphoneUnsupported: 'このランタイムはマイク録音をサポートしていません。',
      noMicrophone: 'マイクが見つかりませんでした。',
      noSpeechDetected: '音声が検出されませんでした',
      playbackFailed: '音声再生に失敗しました',
      recordingFailed: '音声録音に失敗しました',
      sayStopToEnd: phrase => `「${phrase}」と言うと音声チャットを終了できます。`,
      transcriptionFailed: '音声文字起こしに失敗しました',
      transcriptionUnavailable: '音声文字起こしはまだ利用できません。',
      tryRecordingAgain: 'もう一度録音してください。',
      unavailable: '音声は利用できません'
    },
    native: {
      approvalTitle: '承認が必要です',
      approvalTitleNamed: session => `承認が必要です — ${session}`,
      approveAction: '承認',
      rejectAction: '拒否',
      inputTitle: '入力が必要です',
      inputTitleNamed: session => `入力が必要です — ${session}`,
      inputBody: 'Hermes が応答を待っています。',
      turnDoneTitle: 'Hermes が完了しました',
      turnDoneBody: '',
      turnErrorTitle: 'ターンが失敗しました',
      backgroundDoneTitle: 'バックグラウンドタスクが完了しました',
      backgroundFailedTitle: 'バックグラウンドタスクが失敗しました',
      creditsTitle: 'クレジット'
    }
  },

  remoteDisplayBanner: {
    message: reason =>
      `ソフトウェアレンダリングが有効です — リモートディスプレイを検出しました（${reason}）。ちらつきを防ぐため GPU アクセラレーションは無効化されています。`
  },

  billingBlock: {
    titleNous: 'Nous クレジットが不足しています',
    titleProvider: provider => `クレジット不足 — ${provider}`,
    fallbackMessage: 'アカウントのクレジットが不足しています。続行するにはクレジットを追加してください。',
    openBilling: '請求を開く',
    addCredits: 'クレジットを追加',
    dismiss: '閉じる'
  },

  sendDiagnostics: {
    title: 'Nous に診断情報を送信',
    privacyNotice:
      'デバッグバンドルを Nous 内部ストレージにアップロードします（公開ペーストではありません）。システム情報（OS、バージョン、プロバイダー、設定済み API キーの種類 — キー自体は含まれません）と、エージェント/ゲートウェイ/デスクトップの完全なログ（各最大 512 KB。会話内容、ツール出力、ファイルパスを含む可能性が高い）が含まれます。シークレットはアップロード前にマスクされます。閲覧できるのは Nous スタッフと許可された Discord モデレーターのみで、14 日後に自動削除されます。',
    upload: 'アップロード',
    uploading: 'アップロード中…',
    cancel: 'キャンセル',
    close: '閉じる',
    copyLink: 'リンクをコピー',
    uploadIdFallback: id => `表示リンクが返されませんでした — サポートにアップロード ID ${id} をお伝えください`,
    doneTitle: '診断情報を送信しました',
    doneDescription:
      'バンドルは非公開でアップロードされました。サポートスレッドで以下のリンクを共有すると、チームがログを確認できます。',
    failedTitle: 'アップロードに失敗しました',
    failedHint:
      'ターミナルから `hermes debug share --nous` を実行するか、`hermes debug share --local` でアップロードせずにレポートを表示することもできます。',
    handoffLead: '続きは次の場所で:',
    links: {
      github: 'GitHub Issues',
      portal: 'Nous Portal サポート',
      discord: 'Discord'
    }
  },

  titlebar: {
    hideSidebar: 'サイドバーを非表示',
    showSidebar: 'サイドバーを表示',
    search: '検索',
    searchTitle: 'セッション、ビュー、アクションを検索',
    swapSidebarSides: 'サイドバーの向きを切り替え',
    hideRightSidebar: '右サイドバーを非表示',
    showRightSidebar: '右サイドバーを表示',
    unreadSessions: count => (count === 1 ? '未読セッション 1 件' : `未読セッション ${count} 件`),
    muteHaptics: '触覚フィードバックをオフ',
    unmuteHaptics: '触覚フィードバックをオン',
    openSettings: '設定を開く',
    openStarmap: 'メモリグラフを開く',
    resetHudLayout: 'HUD のサイズと位置をリセット'
  },

  language: {
    label: '言語',
    description: 'デスクトップインターフェイスの言語を選択します。',
    saving: '言語を保存中…',
    saveError: '言語の更新に失敗しました',
    switchTo: '言語を切り替え',
    searchPlaceholder: '言語を検索…',
    noResults: '言語が見つかりません'
  },

  settings: {
    uninstallSection: {
      dangerZone: '危険ゾーン',
      checkingInstalled: 'インストール内容を確認中…',
      uninstallHermes: 'Hermes をアンインストール',
      chooseHowMuch:
        '削除する範囲を選択してください。完了するためにアプリが閉じます。インストーラーを開き直せばいつでも戻れます。',
      confirmUninstall: 'アンインストールの確認',
      confirmBody: what => `${what} が削除されます。この操作は取り消せません。`,
      appLabel: 'アプリ：',
      couldNotStart: 'アンインストールを開始できませんでした。',
      uninstalling: 'アンインストール中…',
      yesUninstall: 'はい、アンインストール',
      options: {
        gui: {
          title: 'Chat GUI のみアンインストール',
          description: 'このデスクトップアプリを削除します。Hermes エージェント、設定、チャットはすべて残ります。',
          consequence: 'デスクトップ Chat GUI（このアプリとそのデータ）'
        },
        lite: {
          title: 'GUI とエージェントをアンインストール、データは保持',
          description:
            'アプリと Hermes エージェントを削除しますが、将来の再インストールに備えて設定・チャット・シークレットは保持します。',
          consequence: 'Chat GUI と Hermes エージェント（設定・チャット・シークレットは保持）'
        },
        full: {
          title: 'すべてアンインストール',
          description:
            'アプリ、エージェント、すべてのユーザーデータ（設定、チャット、定期ジョブ、シークレット、ログ）を削除します。',
          consequence: 'すべて——Chat GUI、Hermes エージェント、およびすべての設定・チャット・シークレット・ログ'
        }
      }
    },
    subpages: {
      appearanceTheme: 'テーマ',
      appearanceTypography: 'フォントと表示倍率',
      appearanceWindowLayout: 'ウィンドウとレイアウト',
      appearanceChatDisplay: 'チャット表示',
      appearancePet: 'ペット',
      appearanceGeneral: '一般',
      modelMain: 'メインモデル',
      modelAuxiliary: '補助モデル',
      modelMoa: 'エージェントの協調',
      modelFallbacks: '代替モデル',
      chatBehavior: '動作',
      chatAttachments: '添付ファイル',
      workspaceProjects: 'プロジェクトと検出',
      workspaceShell: 'シェル環境',
      workspaceFiles: 'ファイルと実行',
      safetyApprovals: '承認',
      safetyPrivacy: 'プライバシーとネットワーク',
      safetyCheckpoints: 'チェックポイント',
      browserProfile: 'ブラウザープロファイル',
      browserNetwork: 'ローカル・プライベート URL',
      memoryPersistent: '永続メモリ',
      memoryContext: 'コンテキストと圧縮',
      voiceConversation: '音声会話',
      voiceTranscription: '音声認識',
      voiceSpeech: '音声合成',
      advancedRuntime: 'エージェントの制限',
      advancedTools: 'ツールへのアクセス',
      advancedTerminal: 'ターミナルのバックエンド',
      advancedOutput: '出力の制限',
      advancedDelegation: 'サブエージェント',
      advancedDesktop: 'デスクトップと起動',
      gatewayConnection: 'このウィンドウ',
      gatewayDevices: '保存済みの接続',
      gatewayManagedUpdates: 'リモート更新',
      gatewayManagedUpdatesUnavailable: 'リモート更新には、管理対象 SSH の更新に対応したデスクトップ版が必要です。',
      gatewayManagedUpdatesEmpty: '保存済みの接続に SSH 接続を追加すると、ここで更新を管理できます。',
      keyboardShortcuts: 'キー割り当て',
      hudGesture: 'HUDジェスチャー',
      screenCapture: '画面キャプチャ',
      notificationAlerts: 'デスクトップ通知',
      notificationSounds: 'サウンド',
      archivedSessions: 'アーカイブと保持',
      defaultDirectory: '既定のプロジェクトフォルダー',
      vaultCredentials: '保存済みの認証情報',
      vaultSources: 'パスワードマネージャー',
      appUpdates: 'バージョンと更新',
      uninstall: 'アンインストール',
      billingOverview: '概要',
      billingPlans: 'プラン'
    },
    plugins: {
      openFolder: 'デスクトッププラグインフォルダーを開く',
      installModal: {
        installUncertain:
          'Hermes はインストール結果の待機を終了しましたが、プラグインのインストールはまだ進行中の可能性があります。この画面を閉じ、再インストールする前にプラグイン一覧を再スキャンしてください。',
        installFromGit: 'Git からインストール',
        reviewRepository: 'リポジトリを確認',
        repoPlaceholder: 'https://github.com/owner/repo',
        toolsConnected: n => `${n} 個のツールを接続しました`,
        skillsReady: names =>
          names.length === 1 ? `スキル ${names[0]} の準備ができました` : `${names.length} 個のスキルの準備ができました`,
        nextChat: 'ほかのツールは次のチャットで使えます',
        serverNotConnected: (server, reason) =>
          `MCP サーバー ${server} は接続されていません${reason ? `: ${reason}` : '。'}`
      }
    },
    closeSettings: '設定を閉じる',
    exportConfig: '設定を書き出す',
    importConfig: '設定を読み込む',
    resetToDefaults: 'デフォルトに戻す',
    resetConfirm: 'すべての設定を Hermes のデフォルトに戻しますか？',
    exportFailed: '書き出しに失敗しました',
    resetFailed: 'リセットに失敗しました',
    nav: {
      providers: 'プロバイダー',
      providerAccounts: 'アカウント',
      providerApiKeys: 'API キー',
      providerCustomEndpoints: 'カスタムエンドポイント',
      providerLocalModels: 'ローカルモデル',
      gateway: 'ゲートウェイ',
      apiKeys: 'ツールとキー',
      keybinds: 'キーボードショートカット',
      keysTools: 'ツール',
      keysSettings: '設定',
      mcp: 'MCP',
      archivedChats: 'アーカイブ済みチャット',
      sessions: 'セッション',
      about: '情報',
      billing: '請求',
      notifications: '通知',
      vault: 'パスワードとログイン'
    },
    vault: {
      title: 'パスワードとログイン',
      blurb:
        '「GitHub にログインして」と言えば、エージェントが代わりにサインインします。初めてサインインページに出会ったときにその場でログイン情報を尋ね、以降は自動で処理します。パスワードはこのマシン上で暗号化され、ページに直接入力されます。モデルは一切見ません。',
      count: n => `${n} 件保存済み`,
      loadFailed: 'ボールト項目を読み込めませんでした',
      empty: 'まだ何も保存されていません',
      emptyDesc:
        'ここで何かを追加する必要はありません。エージェントにサイトへのサインインを頼むと、その場で一度だけログイン情報を尋ねます。事前に登録したい場合は「追加」を使ってください。',
      add: '追加',
      addTitle: 'ログイン情報・カード・住所を追加',
      addDescription: 'このマシン上に暗号化して保存されます。エージェントがパスワードを見ることはありません。',
      added: '保存しました。',
      adding: '保存中…',
      addConfirm: '保存',
      kindField: '種類',
      kinds: { login: 'ログイン', payment: '支払いカード', address: '住所' },
      labelField: 'ラベル',
      labelPlaceholder: '例: GitHub 仕事用アカウント',
      labelRequired: 'ラベルは必須です。',
      originField: 'サイトのオリジン',
      originPlaceholder: 'https://github.com',
      originPlaceholderCheckout: 'https://shop.example.com',
      originInvalid: 'https://example.com のような有効な URL を入力してください。',
      identifierTypeField: '識別子の種類',
      identifierTypes: { email: 'メール', phone: '電話番号', username: 'ユーザー名' },
      identifierField: '識別子',
      identifierShown: identifier => identifier,
      passwordField: 'パスワード',
      loginFieldsRequired: '識別子とパスワードは必須です。',
      cardNumberField: 'カード番号',
      cardNameField: 'カード名義',
      expMonthField: '有効期限（月）',
      expYearField: '有効期限（年）',
      cvcField: 'CVC',
      postalField: '郵便番号',
      addressLine1Field: '住所 1 行目',
      addressLine2Field: '住所 2 行目',
      cityField: '市区町村',
      stateField: '都道府県 / 地域',
      countryField: '国',
      optional: '（任意）',
      createdOn: date => `追加日 ${date}`,
      deleteAction: '保存済み項目を削除',
      otpField: '認証キー',
      otpPlaceholder: 'Base32 シークレットまたは otpauth:// リンク',
      otpHint: '2FA を有効にするときにサイトが表示する「セットアップキー」。保存すると Hermes がコードを生成します。',
      twoFactorBadge: '2FA 自動',
      deleteTitle: 'この項目を削除しますか？',
      deleteDescription: label => `「${label}」は暗号化ボールトから削除されます。元に戻せません。`,
      deleteConfirm: '削除',
      sources: {
        title: 'パスワードマネージャー',
        blurb:
          'インストール済みのパスワードマネージャーは自動的に検出されます。エージェントがそこからログイン情報を初めて必要とするときにロック解除を求めます（セッションごとに一度）。メモリに残るのはセッショントークンのみで、エージェントはマスターパスワードやログイン情報を一切見ません。',
        toggleFailed: 'パスワードマネージャーの設定を更新できませんでした',
        notInstalled: name =>
          `未検出です。${name} のコマンドラインツールをインストールしてサインインすると、Hermes が自動的に検出します。`,
        disabledDesc: '検出済みですが、Hermes では無効になっています。',
        lockedDesc:
          '検出済み。エージェントがログイン情報を必要とするときにロック解除を求めます。今すぐ解除することもできます。',
        unlockedDesc: 'このセッションでロック解除済み。30分間操作がないか Hermes を閉じると自動的にロックされます。',
        statusLocked: 'ロック中',
        statusNotDetected: '未検出',
        statusOff: 'オフ',
        statusUnlocked: 'ロック解除済み',
        unlock: 'ロック解除',
        unlocking: 'ロック解除中…',
        lock: 'ロック',
        unlocked: name => `${name} をこのセッションでロック解除しました。`,
        unlockTitle: name => `${name} のロックを解除`,
        unlockDescription:
          'マスターパスワードを入力してください。このマシン上のパスワードマネージャーに渡された後に破棄され、保存・記録されることも、エージェントに表示されることもありません。',
        masterPasswordPlaceholder: 'マスターパスワード'
      }
    },
    notifications: {
      title: '通知',
      intro: 'アプリ内トーストとは別の、ネイティブのデスクトップ通知です。設定は端末ごとに保存されます。',
      enableAll: '通知を有効にする',
      enableAllDesc: 'オフで以下の通知をすべて無効にします。',
      focusedHint: '完了通知は Hermes がバックグラウンドにあるときのみ表示されます。',
      kinds: {
        approval: {
          label: '承認が必要',
          description: 'コマンドが承認または拒否を待っています。'
        },
        input: {
          label: '入力が必要',
          description: 'Hermes が質問したか、パスワードやシークレットを必要としています。'
        },
        turnDone: {
          label: '応答完了',
          description: 'Hermes がバックグラウンドのときにターンが完了しました。'
        },
        turnError: {
          label: 'ターン失敗',
          description: 'バックグラウンドのターンエラー。'
        },
        backgroundDone: {
          label: 'バックグラウンドタスク完了',
          description: 'バックグラウンドのターミナルコマンドが完了しました。'
        },
        credits: {
          label: 'クレジット通知',
          description: 'クレジットの利用が停止または復旧しました。'
        },
        plugin: {
          label: 'プラグイン通知',
          description: 'Hermes がバックグラウンドの間に、デスクトッププラグインが通知を送信しました。'
        }
      },
      test: 'テスト通知を送信',
      testTitle: 'Hermes',
      testBody: '通知は正常に動作しています。',
      testSent:
        'テストを送信しました。表示されない場合は、OS の通知許可と集中モード／おやすみモードを確認してください。',
      testUnsupported: 'このシステムはネイティブ通知に対応していません。',
      completionSoundTitle: '完了サウンド',
      completionSoundDesc: 'エージェントのターン終了時に再生されます。プリセットを選んでここで試聴できます。',
      completionSoundPreview: '試聴'
    },
    sections: {
      model: 'モデル',
      chat: 'チャット',
      appearance: '外観',
      workspace: 'ワークスペース',
      safety: '安全性',
      memory: 'メモリとコンテキスト',
      voice: '音声',
      advanced: '詳細'
    },
    searchPlaceholder: {
      about: 'Hermes Desktop について',
      config: '設定を検索…',
      gateway: 'ゲートウェイ接続…',
      keys: 'API キーを検索…',
      mcp: 'MCP サーバーを検索…',
      sessions: 'アーカイブ済みセッションを検索…'
    },
    modeOptions: {
      light: { label: 'ライト', description: '明るいデスクトップ表示' },
      dark: { label: 'ダーク', description: 'まぶしさを抑えたワークスペース' },
      system: { label: 'システム', description: 'OS の外観に合わせる' }
    },
    appearance: {
      chatTextScaleTitle: 'チャットの文字サイズ',
      chatTextScaleDesc:
        'UI スケールを基準に、会話とメッセージ入力欄の文字を拡大縮小します。サイドバーや操作ボタンのサイズは変わりません。',
      title: '外観',
      intro:
        'デスクトップ専用の表示設定です。モードは明るさ、テーマはアクセントカラーとチャット面のスタイルを制御します。',
      colorMode: 'カラーモード',
      colorModeDesc: '固定モードを選ぶか、Hermes をシステム設定に合わせます。',
      toolViewTitle: 'ツール呼び出しの表示',
      toolViewDesc: 'プロダクト表示は生のツールペイロードを隠し、テクニカル表示は入出力をすべて表示します。',
      hideCodeDiffsTitle: 'コードの差分を非表示',
      hideCodeDiffsDesc: 'ファイル編集は追加・削除行数付きのインラインツール行で表示し、コードは表示しません。',
      hideThreadTimelineTitle: 'スレッドのタイムラインバーを非表示',
      hideThreadTimelineDesc: '各会話の右端にあるナビゲーションバーを非表示にします。',
      reasoningCollapsedTitle: '思考ブロックをデフォルトで折りたたむ',
      reasoningCollapsedDesc: 'ストリーミング中の推論を、開くまで折りたたんだまま利用できるようにします。',
      trajectoryCollapsedTitle: '実行軌跡を要約に折りたたむ',
      trajectoryCollapsedDesc: '最終返信が始まると、思考とツール手順を「N ステップ完了」の一行にまとめます。',
      uiScaleTitle: 'UI スケール',
      uiScaleDesc: (percent: number) =>
        `アプリ全体の文字と UI を拡大縮小します。Cmd/Ctrl と +、-、0 でも変更できます。現在: ${percent}%`,
      sessionDensityTitle: 'セッションリストの密度',
      sessionDensityDesc: 'サイドバーのセッションタイトルの下に表示する情報量を選びます。',
      sessionDensityCompact: 'コンパクト',
      sessionDensityComfortable: '標準',
      sessionDensityDetailed: '詳細',
      tabStripTitle: 'タブバー',
      tabStripDesc:
        'ゾーンの上にタブを表示します。自動では、他にチャットやタイルのゾーンがない限り、ペインが1つのときに隠します。',
      tabStripAuto: '自動',
      tabStripAlways: '常に表示',
      tabStripNever: '表示しない',
      appActionsTitle: 'アプリ操作',
      appActionsDesc:
        '設定・レイアウト・HUD をタイトルバーの左右どちらに置くか。右にするとタブ用のスペースが左に残ります。',
      appActionsLeft: '左',
      appActionsRight: '右',
      terminalFontTitle: 'ターミナルフォント',
      terminalFontDesc:
        'Desktop のターミナルで使用するインストール済みフォントを選びます。Nerd Font は Powerlevel10k とシェルアイコンを表示できます。空欄では内蔵の JetBrains Mono を使用します。',
      terminalFontPlaceholder: 'MesloLGS NF または CSS フォントスタック',
      terminalFontPreview: 'グリフのプレビュー',
      terminalFontReset: '既定値を使用',
      chatFontTitle: 'チャットフォント',
      chatFontDesc:
        'チャットとアプリ全体に使うインストール済みフォントを選択します。OpenDyslexic などの読みやすいフォントに便利です。空欄ならテーマのフォントを使います。',
      chatFontPlaceholder: 'OpenDyslexic または CSS フォントスタック',
      chatFontPreview: 'プレビュー',
      chatFontSample: 'いろはにほへと ちりぬるを 0123456789',
      chatFontReset: 'テーマのフォントを使用',
      translucencyTitle: 'ウィンドウの透過',
      translucencyDesc: 'テキストも含めウィンドウ全体を透過させてデスクトップを表示します。',
      translucencyGlassDesc: 'マットガラス: デスクトップが滑らかなぼかしとして透け、テキストは鮮明なまま。',
      translucencyModeClear: 'クリア',
      translucencyModeGlass: 'ガラス',
      translucencyTintTitle: '色味',
      translucencyFadeTitle: 'フェード',
      translucencyFrostTitle: 'くもりの質感',
      translucencyFrost: {
        'under-window': '深い',
        popover: 'やわらか',
        titlebar: '明るい',
        header: 'まぶしい'
      },
      translucencyScopeTitle: '適用範囲',
      translucencyScope: {
        window: 'ウィンドウ全体',
        sidebar: 'サイドバーのみ'
      },
      backdropTitle: 'チャット背景',
      backdropDesc: '会話の背後に表示される淡い彫像の画像。',
      userBubbleTitle: 'メッセージの吹き出し',
      userBubbleDesc: '自分のメッセージの透け具合。0 で不透明、100 で枠線だけが残ります。',
      textDirectionTitle: 'テキストの方向',
      textDirectionDesc:
        'チャットのメッセージと入力欄の文字方向を設定します。「自動」は各段落の最初の文字で判断します。混在したテキストの並びがおかしいときは方向を選んでください。コードは常に左から右に表示されます。',
      textDirection: { auto: '自動', rtl: '右から左', ltr: '左から右' },
      introSplashTitle: 'イントロ表示',
      introSplashDesc: '空のチャットに表示されるワードマークとプロンプト。',
      modelPricingTitle: 'モデル料金',
      modelPricingDesc: 'モデル選択で、100万トークンあたりの入力・出力・キャッシュ読み取り料金を表示します。',
      reactionsTitle: 'メッセージリアクション',
      reactionsDesc:
        'iMessage風の絵文字タップバック — メッセージにリアクションでき、Hermesもあなたのメッセージにリアクションします。',
      tipsTitle: 'アプリ内ヒント',
      tipsDesc:
        'アプリや Hermes からのヒントをときどき表示します。各ヒントは一度だけ表示されます。利用開始から30日後に自動でオフになりますが、再びオンにできます。',
      tipsReset: (count: number) => `${count}件のヒントをもう一度表示`,
      toursTitle: 'ガイドツアー',
      toursDesc:
        '各ステップを強調しながら、Hermes がアプリを案内します。利用開始から30日後に自動でオフになりますが、再びオンにできます。',
      composerPopoutTitle: 'フローティング入力欄',
      composerPopoutDesc:
        '入力欄をドックからドラッグして外せるようにします。オフの間は画面下部にドッキングされたままです。',
      fileBrowserTitle: 'ファイルブラウザ',
      fileBrowserDesc:
        'ワークスペースを開いているとき、チャットの横にファイルブラウザを表示します。タイトルバーのボタンでも切り替わります。',
      vibeHeartsTitle: 'バイブハート',
      vibeHeartsDesc:
        'ありがとう・愛してる・good bot・ハート絵文字のときに浮かぶハート。上のメッセージリアクションとは別です。',
      embedsTitle: 'インライン埋め込み',
      embedsDesc:
        'リッチプレビューは第三者サイト（YouTube、X など）から読み込まれます。確認は許可するまでプレースホルダーを表示し、常には自動で読み込み、オフはリンクのままにします。',
      embedsAsk: '確認',
      embedsAlways: '常に',
      embedsOff: 'オフ',
      embedsReset: (count: number) => `許可した${count}件のサービスをリセット`,
      resumeLastSessionTitle: '起動時に前回のチャットを再開',
      resumeLastSessionDesc:
        'オンの場合、コールドスタート時に直近のチャットを再び開きます。オフにすると常に新しいチャットから始まります。',
      product: 'プロダクト',
      productDesc: '読みやすいツール活動と簡潔な要約を表示します。',
      technical: 'テクニカル',
      technicalDesc: '生のツール引数、結果、低レベルの詳細を含めます。',
      themeTitle: 'テーマ',
      themeDesc: 'デスクトップ専用のパレットです。選択したモードの上に適用されます。',
      themeProfileNote: profile =>
        `「${profile}」プロファイルに保存されます。プロファイルごとに個別のテーマを保持します。`,
      installTitle: 'VS Code から導入',
      installDesc:
        'Marketplace の拡張機能 ID（例: dracula-theme.theme-dracula）を貼り付けると、その配色テーマをデスクトップ用パレットに変換します。',
      installPlaceholder: 'publisher.extension',
      installButton: 'インストール',
      installing: 'インストール中…',
      installError: 'そのテーマをインストールできませんでした。',
      installed: name => `「${name}」をインストールしました。`,
      removeTheme: 'テーマを削除',
      importedBadge: 'インポート済み',
      pet: {
        title: 'ペット',
        intro:
          'アプリ上に浮かぶ petdex のアニメーションマスコットを採用しましょう。ツール実行中は走り、成功すると喜び、エラーでしょんぼりと、Hermes の状態に反応します。',
        restartHint:
          'ペット機能には再起動が必要です。この機能が追加される前に起動したアプリが動作中です。Hermes を終了して再度開き、このページに戻ってください。',
        scaleTitle: 'サイズ',
        scaleDesc: '浮遊マスコットの大きさを変更します。すべての画面に即時反映されます。',
        roamTitle: '散歩',
        roamDesc: 'アイドル中にペットがウィンドウ内を自由に歩き回ります。',
        chooseTitle: 'ペットを選ぶ',
        chooseDesc: '選ぶと（必要に応じて）インストールされ、アクティブになります。',
        searchPlaceholder: 'ペットを検索…',
        unreachable: 'petdex ギャラリーに接続できませんでした。接続を確認してこのページを開き直してください。',
        noMatch: query => `「${query}」に一致するペットがありません。`,
        installedTag: 'インストール済み',
        generatedTag: '生成',
        countCapped: (cap, total) => `${total} 件中 ${cap} 件を表示中——入力して絞り込めます。`,
        count: n => `${n} 件のペット。`,
        uninstall: name => `${name} をアンインストール`,
        delete: name => `${name} を削除`,
        deleteTitle: name => `${name} を削除しますか？`,
        deleteBody: 'ペットを完全に削除します。再インストールはできません。',
        deleteConfirm: '削除',
        rename: name => `${name} の名前を変更`,
        renameTitle: 'ペットの名前を変更',
        renamePlaceholder: 'ペットに名前を付ける',
        renameSave: '保存',
        exportPet: name => `${name} をエクスポート`,
        adoptFailed: slug => `${slug} を採用できませんでした`,
        uninstallFailed: slug => `${slug} をアンインストールできませんでした`,
        renameFailed: slug => `${slug} の名前を変更できませんでした`,
        exportFailed: slug => `${slug} をエクスポートできませんでした`,
        noneAvailable: 'オンにできるペットがありません。',
        turnOnFailed: 'ペットをオンにできませんでした。',
        turnOffFailed: 'ペットをオフにできませんでした。'
      }
    },
    fieldLabels: defineFieldCopy({
      model: 'デフォルトモデル',
      modelContextLength:
        'メインのチャットモデルのみ、検出されたコンテキストウィンドウを上書きします（トークン数）。0 のままにすると、選択したモデルから検出された値を使用します。補助モデル/MoA モデルには影響しません。',
      fallbackProviders: 'フォールバックモデル',
      toolsets: '有効なツールセット',
      timezone: 'タイムゾーン',
      display: {
        personality: '人格',
        showReasoning: '推論ブロック'
      },
      desktop: {
        repoScanEnabled: 'リポジトリの自動検出',
        repoScanRoots: 'リポジトリの検索ルート',
        repoScanExcludePaths: '除外するリポジトリパス'
      },
      agent: {
        maxTurns: '最大エージェントステップ',
        imageInputMode: '画像添付',
        apiMaxRetries: 'API 再試行回数',
        serviceTier: 'サービス階層',
        toolUseEnforcement: 'ツール使用の強制'
      },
      terminal: {
        cwd: '作業ディレクトリ',
        backend: '実行バックエンド',
        timeout: 'コマンドタイムアウト',
        persistentShell: '永続シェル',
        envPassthrough: '環境変数の引き継ぎ',
        dockerImage: 'Docker イメージ',
        singularityImage: 'Singularity イメージ',
        modalImage: 'Modal イメージ',
        daytonaImage: 'Daytona イメージ'
      },
      fileReadMaxChars: 'ファイル読み取り上限',
      toolOutput: {
        maxBytes: 'ターミナル出力上限',
        maxLines: 'ファイルページ上限',
        maxLineLength: '行長上限'
      },
      codeExecution: {
        mode: 'コード実行モード'
      },
      approvals: {
        mode: '承認モード',
        timeout: '承認タイムアウト',
        mcpReloadConfirm: 'MCP 再読み込みの確認'
      },
      commandAllowlist: 'コマンド許可リスト',
      security: {
        redactSecrets: 'シークレットを伏せる',
        allowPrivateUrls: 'プライベート URL を許可'
      },
      browser: {
        allowPrivateUrls: 'ブラウザーのプライベート URL',
        autoLocalForPrivateUrls: 'プライベート URL にはローカルブラウザーを使用'
      },
      checkpoints: {
        enabled: 'ファイルチェックポイント',
        maxSnapshots: 'チェックポイント上限'
      },
      voice: {
        maxRecordingSeconds: '最大録音時間',
        autoTts: '応答を読み上げる'
      },
      stt: {
        enabled: '音声認識',
        provider: '音声認識プロバイダー',
        local: {
          model: 'ローカル文字起こしモデル',
          language: '文字起こし言語'
        },
        openai: {
          model: 'OpenAI STT モデル'
        },
        groq: {
          model: 'Groq STT モデル'
        },
        mistral: {
          model: 'Mistral STT モデル'
        },
        elevenlabs: {
          modelId: 'ElevenLabs STT モデル',
          languageCode: 'ElevenLabs 言語',
          tagAudioEvents: '音声イベントをタグ付け',
          diarize: '話者分離'
        }
      },
      tts: {
        provider: '音声合成プロバイダー',
        edge: {
          voice: 'Edge 音声'
        },
        openai: {
          model: 'OpenAI TTS モデル',
          voice: 'OpenAI 音声'
        },
        elevenlabs: {
          voiceId: 'ElevenLabs 音声',
          modelId: 'ElevenLabs モデル'
        },
        xai: {
          voiceId: 'xAI (Grok) 音声',
          language: 'xAI 言語',
          speed: '再生速度',
          autoSpeechTags: '自動音声タグ',
          optimizeStreamingLatency: 'ストリーミング遅延最適化',
          sampleRate: 'サンプルレート',
          bitRate: 'ビットレート'
        },
        minimax: {
          model: 'MiniMax TTS モデル',
          voiceId: 'MiniMax 音声'
        },
        mistral: {
          model: 'Mistral TTS モデル',
          voiceId: 'Mistral 音声'
        },
        gemini: {
          model: 'Gemini TTS モデル',
          voice: 'Gemini 音声'
        },
        neutts: {
          model: 'NeuTTS モデル',
          device: 'NeuTTS デバイス'
        },
        kittentts: {
          model: 'KittenTTS モデル',
          voice: 'KittenTTS 音声'
        },
        piper: {
          voice: 'Piper 音声'
        }
      },
      memory: {
        memoryEnabled: '永続メモリ',
        userProfileEnabled: 'ユーザープロファイル',
        memoryCharLimit: 'メモリ予算',
        userCharLimit: 'プロファイル予算',
        provider: 'メモリプロバイダー'
      },
      context: {
        engine: 'コンテキストエンジン'
      },
      compression: {
        enabled: '自動圧縮',
        threshold: '圧縮しきい値',
        codexGpt55Autoraise: 'Codex 圧縮の自動引き上げ',
        targetRatio: '圧縮目標',
        protectLastN: '保護する直近メッセージ'
      },
      auxiliary: {
        compression: {
          timeout: '圧縮モデルのタイムアウト（秒）'
        }
      },
      delegation: {
        model: 'サブエージェントモデル',
        provider: 'サブエージェントプロバイダー',
        maxIterations: 'サブエージェントターン上限',
        maxConcurrentChildren: '並列サブエージェント',
        childTimeoutSeconds: 'サブエージェントタイムアウト',
        reasoningEffort: 'サブエージェント推論強度'
      },
      updates: {
        nonInteractiveLocalChanges: 'アプリ内更新時のローカル変更'
      }
    }),
    fieldDescriptions: defineFieldCopy({
      model: 'コンポーザーで別のモデルを選ばない限り、新しいチャットで使用されます。',
      modelContextLength: '0 のままにすると、選択したモデルから検出されたコンテキストウィンドウを使用します。',
      fallbackProviders: 'デフォルトモデルが失敗したときに試す provider:model 形式のバックアップです。',
      display: {
        personality: '新しいセッションのデフォルトのアシスタントスタイルです。',
        showReasoning: 'バックエンドが推論内容を提供したときに表示します。'
      },
      desktop: {
        repoScanEnabled: 'ローカルフォルダを検索して Git リポジトリをプロジェクトに表示します。',
        repoScanRoots: '検索するフォルダです。空の場合はホームディレクトリを検索します。',
        repoScanExcludePaths: 'リポジトリ検出時に除外するフォルダとその配下です。'
      },
      timezone:
        'Hermes がローカル時刻のコンテキストを必要とするときに使用します。空欄ならシステムのタイムゾーンを使います。',
      agent: {
        imageInputMode: '画像添付をモデルへ送る方法を制御します。',
        maxTurns: 'Hermes が 1 回の実行を停止するまでのツール呼び出しターン上限です。'
      },
      terminal: {
        cwd: 'ツールとターミナル作業のデフォルトプロジェクトフォルダーです。',
        persistentShell: 'バックエンドが対応している場合、コマンド間でシェル状態を保持します。',
        envPassthrough: 'ツール実行へ渡す環境変数です。'
      },
      codeExecution: {
        mode: 'コード実行を現在のプロジェクトにどれだけ厳密に制限するかを設定します。'
      },
      fileReadMaxChars: 'Hermes が 1 回のファイル読み取りで取得できる最大文字数です。',
      approvals: {
        mode: '明示的な承認が必要なコマンドを Hermes がどう扱うかを設定します。',
        timeout:
          'メッセージングプラットフォームで承認プロンプトがタイムアウトするまで待つ時間です。アプリとターミナルは回答するま…33219 tokens truncated…たはデスクトップログで確認できます。',
    activeDesc:
      'これは一回限りのセットアップです。Hermes インストーラーが依存関係をダウンロードしてマシンを設定しています。以降の起動ではこの手順はスキップされます。',
    progress: (completed, total) => `${total} ステップ中 ${completed} 完了`,
    currentStage: stage => ` — 現在: ${stage}`,
    fetchingManifest: 'インストーラーマニフェストを取得中...',
    error: 'エラー',
    hideOutput: 'インストーラーの出力を非表示',
    showOutput: 'インストーラーの出力を表示',
    lines: count => `${count} 行`,
    noOutput: 'まだ出力がありません。',
    cancelling: 'キャンセル中...',
    cancelInstall: 'インストールをキャンセル',
    transcriptSaved: 'フルトランスクリプトを保存しました:',
    copiedOutput: 'コピーしました！',
    copyOutput: '出力をコピー',
    reloadRetry: '再読み込みして再試行'
  },

  onboarding: {
    headerTitle: 'Hermes Agent のセットアップをしましょう',
    headerDesc: 'チャットを始めるにはモデルプロバイダーを接続してください。ほとんどのオプションはワンクリックです。',
    preparingInstall: 'Hermes はインストールを完了中です。初回実行では通常 1 分以内に完了します。',
    starting: 'Hermes を起動中…',
    lookingUpProviders: 'プロバイダーを検索中...',
    collapse: '折りたたむ',
    otherProviders: 'その他のプロバイダー',
    haveApiKey: 'API キーをお持ちです',
    chooseLater: '後でプロバイダーを選択します',
    recommended: '推奨',
    connected: '接続済み',
    featuredPitch: '1 つのサブスクリプションで 300 以上の最先端モデル — Hermes を実行するための推奨方法',
    fireworksPitch: '直接モデル API — Fireworks がホストする最先端モデル',
    localModelsTitle: 'モデルをローカルで実行',
    localModelsPitch: 'アカウント不要——モデルをダウンロードしてこのマシンで実行',
    openRouterPitch: '1 つのキーで数百のモデル — 堅実なデフォルト',
    apiKeyOptions: {
      fireworks: {
        short: 'モデル API に直接接続',
        description: 'Fireworks AI がホストするモデルに直接アクセスします。'
      },
      openrouter: {
        short: '1 つのキーで多くのモデル',
        description: '1 つのキーで数百のモデルをホスト。新規インストールのデフォルトとして最適。'
      },
      openai: { short: 'GPT クラスのモデル', description: 'OpenAI モデルへの直接アクセス。' },
      gemini: { short: 'Gemini モデル', description: 'Google Gemini モデルへの直接アクセス。' },
      xai: { short: 'Grok モデル', description: 'xAI Grok モデルへの直接アクセス。' },
      local: {
        short: 'セルフホスト',
        description:
          'ローカルまたはセルフホストの OpenAI 互換エンドポイント（vLLM、llama.cpp、Ollama など）に Hermes を接続。'
      }
    },
    backToSignIn: 'サインインに戻る',
    getKey: 'キーを取得',
    replaceCurrent: '現在の値を置き換え',
    pasteApiKey: 'API キーを貼り付け',
    couldNotSave: '認証情報を保存できませんでした。',
    connecting: '接続中',
    update: '更新',
    flowSubtitles: {
      pkce: 'ブラウザーを開いてサインインし、ここに戻ります',
      device_code: 'ブラウザーで確認ページを開きます — Hermes が自動接続します',
      external: 'ターミナルで一度サインインして、チャットに戻ります'
    },
    startingSignIn: provider => `${provider} のサインインを開始中...`,
    verifyingCode: provider => `${provider} でコードを確認中...`,
    connectedProvider: provider => `${provider} が接続されました`,
    connectedPicking: provider => `${provider} が接続されました。デフォルトモデルを選択中...`,
    signInFailed: 'サインインに失敗しました。再試行してください。',
    signInExpired:
      '承認待ちでタイムアウトしました。多くの場合、開いたタブのサインインページが止まっている（サーバー側の問題）ためです。そのページでサインインを完了してから再試行してください。解決しない場合は API キーまたは CLI を利用してください。',
    pickDifferentProvider: '別のプロバイダーを選択',
    signInWith: provider => `${provider} でサインイン`,
    openedBrowser: provider => `${provider} をブラウザーで開きました。`,
    authorizeThere: 'そこで Hermes を承認してください。',
    copyAuthCode: '認証コードをコピーして以下に貼り付けてください。',
    pasteAuthCode: '認証コードを貼り付け',
    reopenAuthPage: '認証ページを再度開く',
    autoBrowser: provider =>
      `${provider} をブラウザーで開きました。Hermes をそこで承認すれば自動接続されます。コピーや貼り付けは不要です。`,
    reopenSignInPage: 'サインインページを再度開く',
    waitingAuthorize: '承認を待っています...',
    externalPending: provider =>
      `${provider} は独自の CLI からサインインします。ターミナルでこのコマンドを実行してから、戻って「サインインしました」を選択してください:`,
    signedIn: 'サインインしました',
    deviceCodeOpened: provider => `${provider} をブラウザーで開きました。そこにこのコードを入力してください:`,
    reopenVerification: '確認ページを再度開く',
    copy: 'コピー',
    defaultModel: 'デフォルトモデル',
    freeTier: '無料プラン',
    pro: 'Pro',
    free: '無料',
    price: (input, output) => `${input} 入力 / ${output} 出力 per Mtok`,
    change: '変更',
    startChatting: '始める',
    docs: provider => `${provider} ドキュメント`
  },

  modelPicker: {
    title: 'モデルを切り替え',
    current: '現在:',
    unknown: '(不明)',
    search: 'プロバイダーとモデルをフィルター...',
    noModels: 'モデルが見つかりません。',
    addProvider: 'プロバイダーを追加',
    loadFailed: 'モデルを読み込めませんでした',
    downloading: 'ダウンロード中',
    localDownloadsHeading: 'ローカル',
    noAuthenticatedProviders: '認証済みプロバイダーがありません。',
    pro: 'Pro',
    proNeedsSubscription: 'Pro モデルには有料の Nous サブスクリプションが必要です。',
    free: '無料',
    freeTier: '無料プラン',
    priceTitle: '100 万トークンあたりの入力/出力価格',
    wasPrice: '旧価格',
    customModel: 'カスタムモデル',
    addCustomModelAction: 'カスタムモデルを追加…',
    customModelPlaceholder: 'モデル ID を入力（例: openai/gpt-5）'
  },

  modelVisibility: {
    title: 'モデル',
    search: 'モデルを検索',
    noAuthenticatedProviders: '認証済みプロバイダーがありません。',
    addProvider: 'プロバイダーを追加…',
    addCustomModel: 'カスタムモデルを追加',
    removeCustomModel: 'カスタムモデルを削除',
    resetToDefaults: 'デフォルトに戻す',
    resetConfirm: 'モデルの表示設定をデフォルトに戻しますか？',
    resetDescription:
      '表示・非表示の選択が消去され、各プロバイダーのデフォルトの一覧に戻ります。追加したカスタムモデルは残り、表示されます。',
    resetAction: 'リセット'
  },

  shell: {
    windowControls: 'ウィンドウコントロール',
    paneControls: 'ペインコントロール',
    appControls: 'アプリコントロール',
    modelMenu: {
      search: 'モデルを検索',
      noModels: 'モデルが見つかりません',
      editModels: 'モデルを編集…',
      followDefault: '設定のデフォルトを使用',
      refreshModels: 'モデルを更新',
      favorites: 'お気に入り',
      addFavorite: 'お気に入りに追加',
      removeFavorite: 'お気に入りから削除',
      favoriteShortcut: '⇧ クリック',
      fast: '高速',
      free: '無料',
      cacheRead: 'キャッシュ読み取り',
      priceTitle: (input: string, output: string, cache: string) =>
        `入力 ${input}/Mtok · 出力 ${output}/Mtok` + (cache ? ` · キャッシュ読み取り ${cache}/Mtok` : '')
    },
    modelOptions: {
      noOptions: 'このモデルにはオプションがありません',
      options: 'オプション',
      thinking: '思考',
      fast: '高速',
      effort: '努力度',
      minimal: '最小',
      low: '低',
      medium: '中',
      high: '高',
      xhigh: '特高',
      max: '最大',
      ultra: 'ウルトラ',
      sendsOnRoute: (level: string) => `このルートでは ${level} を送信`,
      updateFailed: 'モデルオプションの更新に失敗しました',
      fastFailed: '高速モードの更新に失敗しました'
    },
    gatewayMenu: {
      gateway: 'ゲートウェイ',
      connected: '接続済み',
      connecting: '接続中',
      offline: 'オフライン',
      inferenceReady: '推論準備完了',
      inferenceNotReady: '推論準備未完了',
      checkingInference: '推論を確認中',
      disconnected: '切断済み',
      reconnectGateway: 'ゲートウェイに再接続',
      openSystem: 'システムパネルを開く',
      connection: label => `接続: ${label}`,
      recentActivity: '最近のアクティビティ',
      viewAllLogs: 'すべてのログを見る →',
      messagingPlatforms: 'メッセージングプラットフォーム'
    },
    approvalMode: {
      title: '承認モード',
      ariaLabel: mode => `承認モード: ${mode}`,
      manual: '手動',
      manualDescription: '承認が必要な操作の前に確認します',
      smart: 'スマート',
      smartDescription: '必要な場合にのみ確認します',
      off: 'オフ',
      offDescription: '承認プロンプトなしで実行します'
    },
    statusbar: {
      unknown: '不明',
      restart: '再起動',
      update: '更新',
      updateInProgress: '更新中',
      commitsBehind: (count, branch) => `${branch} より ${count} コミット遅れています`,
      desktopVersion: version => `Hermes Desktop v${version}`,
      backendVersion: version => `バックエンド v${version}`,
      clientLabel: version => `クライアント v${version}`,
      connectionSsh: host => `SSH: ${host}`,
      connectionRemote: host => `リモート: ${host}`,
      connectionCloud: host => `クラウド: ${host}`,
      connectionCloudTooltip: host => `Hermes Cloud · ${host}`,
      connectionSshTooltip: host => `SSH · ${host}`,
      connectionRemoteTooltip: host => `Remote · ${host}`,
      backendLabel: version => `バックエンド v${version}`,
      commit: sha => `コミット ${sha}`,
      branch: branch => `ブランチ ${branch}`,
      closeCommandCenter: 'コマンドセンターを閉じる',
      openCommandCenter: 'コマンドセンターを開く',
      showTerminal: 'ターミナルを表示',
      hideTerminal: 'ターミナルを非表示',
      gateway: 'ゲートウェイ',
      gatewayReady: '準備完了',
      gatewayNeedsSetup: '設定が必要',
      gatewayUnavailable: '推論を利用できません',
      gatewayChecking: '確認中',
      gatewayConnecting: '接続中',
      gatewayOffline: 'オフライン',
      gatewayRestarting: '再起動中…',
      gatewayTitle: 'ゲートウェイ',
      agents: 'エージェント',
      closeAgents: 'エージェントを閉じる',
      openAgents: 'エージェントを開く',
      subagents: count => `${count} サブエージェント`,
      failed: count => `${count} 失敗`,
      running: count => `${count} 実行中`,
      cron: 'Cron',
      openCron: 'Cron ジョブを開く',
      starmap: 'メモリグラフ',
      openStarmap: 'メモリグラフを開く',
      turnRunning: '実行中',
      contextUsage: 'コンテキスト使用状況',
      compressions: count => `圧縮回数: ${count}`,
      systemResources: {
        title: 'システムリソース',
        loading: 'リソース…',
        gpuUtilization: 'GPU 使用率',
        gpuMemory: 'GPU メモリ',
        ram: 'RAM',
        unifiedNote: 'ユニファイドメモリ——GPU とシステムがこのプールを共有します。',
        toggle: 'システムリソース'
      },
      contextUsagePanel: {
        categories: {
          conversation: '会話',
          mcp: 'MCP',
          memory: 'メモリ',
          rules: 'ルール',
          skills: 'スキル',
          subagent_definitions: 'サブエージェント定義',
          system_prompt: 'システムプロンプト',
          tool_definitions: 'ツール定義'
        },
        empty: 'コンテキストデータはまだありません',
        loading: '内訳を読み込み中…',
        percentFull: percent => `${percent}% 使用中`,
        title: 'コンテキスト使用状況',
        tokenSummary: (used, max) => `${used} / ${max} Tokens`
      },
      focusedSince: 'フォーカスしてから',
      focusedSinceTitle: 'このチャットをフォーカスしてからの時間。ターンの実行時間ではありません',
      yoloOn: 'YOLO オン — 危険なコマンドを自動承認中。Shift+クリックで全体に切り替え。',
      yoloOff: 'YOLO オフ。Shift+クリックで全体に切り替え。',
      modelNone: 'なし',
      noModel: 'モデルなし',
      switchModel: 'モデルを切り替え',
      openModelPicker: 'モデルピッカーを開く',
      modelPinned: '手動で固定中 — 新しいチャットは設定のデフォルトではなくこのモデルを使用します',
      modelTitle: (provider, model) => `モデル · ${provider}: ${model}`,
      providerModelTitle: (provider, model) => `${provider} · ${model}`
    }
  },

  rightSidebar: {
    terminalReadOnly: '読み取り専用の出力',
    terminalReadOnlyHelp:
      'プロンプトに応答するには、バックグラウンドのコマンドを停止し、新しいターミナルで実行してください。新しいターミナルは別のシェルを開き、このプロセスには接続しません。',
    terminalOpenInteractive: '新しいターミナルを開く',
    aria: '右サイドバー',
    panelsAria: '右サイドバーパネル',
    files: 'ファイルシステム',
    terminal: 'ターミナル',
    noFolderSelected: 'フォルダーが選択されていません',
    changeCwdTitle: '作業ディレクトリを変更',
    remotePickerTitle: 'リモートフォルダーを選択',
    remotePickerDescription: '接続中のバックエンド上のフォルダーを参照します。',
    remotePickerSelect: 'フォルダーを選択',
    remotePickerNewFolder: '新しいフォルダー',
    remotePickerFolderName: 'フォルダー名',
    remotePickerCreateFolder: 'フォルダーを作成',
    remotePickerInvalidFolderName: 'スラッシュを含まない 1 つのフォルダー名を入力してください。',
    remotePickerCreateFolderFailed: error => `フォルダーを作成できませんでした (${error})。`,
    folderTip: cwd => cwd,
    openFolder: 'フォルダーを開く',
    refreshTree: 'ツリーを更新',
    collapseAll: 'すべてのフォルダーを折りたたむ',
    showIgnored: 'gitignore されたファイルを表示',
    hideIgnored: 'gitignore されたファイルを非表示',
    previewUnavailable: 'プレビューは利用できません',
    couldNotPreview: path => `${path} をプレビューできませんでした`,
    noProjectTitle: 'プロジェクトなし',
    noProjectBody: 'プロジェクトを開くと、ファイルの閲覧と変更の確認ができます。',
    noProjectOpen: 'プロジェクト未選択',
    noDiffs: '差分なし',
    unreadableTitle: '読み取り不可',
    unreadableBody: error => `このフォルダーを読み取れませんでした (${error})。`,
    emptyTitle: '空',
    emptyBody: 'このフォルダーは空です。',
    treeErrorTitle: 'ツリーエラー',
    treeErrorBody: 'ファイルツリーがこのフォルダーのレンダリング中にエラーが発生しました。',
    tryAgain: '再試行',
    loadingTree: 'ファイルツリーを読み込み中',
    loadingFiles: 'ファイルを読み込み中',
    terminalHide: 'ターミナルを非表示',
    terminalsAria: 'ターミナル',
    terminalNew: '新しいターミナル',
    terminalCloseOthers: '他を閉じる',
    terminalCloseAll: 'すべて閉じる',
    addToChat: 'チャットに追加'
  },

  preview: {
    tab: 'プレビュー',
    pin: 'ワークスペースにピン留め',
    unpin: 'ワークスペースからピン留めを外す',
    closePane: 'プレビューペインを閉じる',
    loading: 'プレビューを読み込み中',
    unavailable: 'プレビューは利用できません',
    missingTitle: 'ファイルは存在しません',
    missingBody: label =>
      `${label} は削除・移動されたか、一時的な場所が消去されました。このタブは次回の起動時には復元されません。`,
    opening: '開いています...',
    hide: '非表示',
    openPreview: 'プレビューを開く',
    openInBrowser: 'ブラウザで開く',
    openInExternal: '外部で開く',
    popIn: 'ポップイン',
    popOut: 'ポップアウト',
    linkHint: '⌘/Ctrl+クリックでプレビューペイン',
    sourceLineTitle: 'クリックして選択 · Shift クリックで拡張 · コンポーザーにドラッグ',
    source: 'ソース',
    renderedPreview: 'プレビュー',
    diff: '差分',
    unknownSize: 'サイズ不明',
    binaryTitle: 'これはバイナリファイルのようです',
    binaryBody: label => `${label} をプレビューすると読み取り不能なテキストが表示される場合があります。`,
    largeTitle: 'このファイルは大きいです',
    largeBody: (label, size) => `${label} は ${size} です。Hermes は最初の 512 KB のみを表示します。`,
    previewAnyway: 'とにかくプレビュー',
    truncated: '最初の 512 KB を表示しています。',
    noInlineTitle: 'インラインプレビューなし',
    noInlineBody: mimeType => `${mimeType || 'このファイルタイプ'} はコンテキストとして添付できます。`,
    edit: '編集',
    editing: '編集中',
    unsavedChanges: '未保存の変更',
    saveFailed: message => `保存できませんでした：${message}`,
    diskChangedTitle: 'ファイルがディスク上で変更されました',
    diskChangedBody:
      'このファイルは開いてから変更されています。あなたの版で上書きするか、編集を破棄して再読み込みしますか？',
    overwrite: '上書き',
    discardReload: '破棄して再読み込み',
    console: {
      deselect: 'エントリーの選択を解除',
      select: 'エントリーを選択',
      copyFailed: 'コンソール出力をコピーできませんでした',
      copyEntry: 'このエントリーをコピー',
      sendEntry: 'このエントリーをチャットに送信',
      messages: count => `${count} 件のコンソールメッセージ`,
      resize: 'プレビューコンソールのサイズ変更',
      title: 'プレビューコンソール',
      selected: count => `${count} 件選択`,
      sendToChat: 'チャットに送信',
      copySelected: '選択をクリップボードにコピー',
      copyAll: 'すべてをクリップボードにコピー',
      copy: 'コピー',
      clear: 'クリア',
      empty: 'コンソールメッセージはまだありません。',
      promptHeader: 'プレビューコンソール:',
      sentTitle: 'チャットに送信しました',
      sentMessage: count => `${count} 件のログエントリーがコンポーザーに追加されました`
    },
    web: {
      appFailedToBoot: 'プレビューアプリの起動に失敗しました',
      serverNotFound: 'サーバーが見つかりません',
      remoteLoopback:
        'このアドレスはエージェントを実行しているマシンを指しており、このマシンではありません。ブラウザペインはページをローカルで読み込むため、リモートの開発サーバーにはポート転送か到達可能なホスト名が必要です。',
      failedToLoad: 'プレビューの読み込みに失敗しました',
      tryAgain: '再試行',
      restarting: 'Hermes を再起動中...',
      askRestart: 'Hermes にサーバーの再起動を依頼',
      lookingRestart: taskId => `Hermes は再起動するプレビューサーバーを検索中です (${taskId})`,
      restartingTitle: 'プレビューサーバーを再起動中',
      restartingMessage: 'Hermes はバックグラウンドで作業中です。進捗はプレビューコンソールで確認してください。',
      startRestartFailed: message => `サーバー再起動を開始できませんでした: ${message}`,
      restartFailed: 'サーバーの再起動に失敗しました',
      hideConsole: 'プレビューコンソールを非表示',
      showConsole: 'プレビューコンソールを表示',
      hideDevTools: 'プレビュー DevTools を非表示',
      openDevTools: 'プレビュー DevTools を開く',
      goBack: '戻る',
      goForward: '進む',
      reload: 'ページを再読み込み',
      address: 'アドレス',
      addressPlaceholder: 'アドレスを入力',
      blankPageBody: '上のアドレス欄に入力するか、Hermes にページを開くよう頼んでください。',
      finishedRestarting: message =>
        `Hermes がプレビューサーバーの再起動を完了しました${message ? `: ${message}` : ''}`,
      failedRestarting: message => `サーバーの再起動に失敗しました: ${message}`,
      unknownError: '不明なエラー',
      restartedTitle: 'プレビューサーバーが再起動しました',
      reloadingNow: 'プレビューを再読み込み中です。',
      restartFailedTitle: 'プレビューの再起動に失敗しました',
      restartFailedMessage: 'Hermes がサーバーを再起動できませんでした。',
      stillWorking:
        'Hermes はまだ作業中ですが、再起動の結果がまだ届いていません。サーバーコマンドがフォアグラウンドで実行されている可能性があります。',
      workspaceReloading: 'ワークスペースが変更され、プレビューを再読み込み中',
      fileChanged: url => `ファイルが変更され、プレビューを再読み込み中: ${url}`,
      filesChanged: (count, url) => `${count} 件のファイルが変更され、プレビューを再読み込み中: ${url}`,
      watchFailed: message => `プレビューファイルを監視できませんでした: ${message}`,
      moduleMimeDescription:
        'モジュールスクリプトが間違った MIME タイプで提供されています。通常、静的ファイルサーバーがプロジェクトの開発サーバーの代わりに Vite/React アプリを提供していることを意味します。',
      loadFailedConsole: (code, message) => `読み込みに失敗しました${code ? ` (${code})` : ''}: ${message}`,
      unreachableDescription: 'プレビューページに到達できませんでした。',
      openTarget: url => `${url} を開く`,
      fallbackTitle: 'プレビュー'
    }
  },

  interfaceMode: {
    title: 'インターフェースモード',
    hint: '表示される内容が変わるだけで、Hermes にできることは変わりません。',
    sessionNote:
      'シンプルモードで設定されています。ここでの変更はこのセッション中のみ有効です。自分の設定にするには詳細モードに切り替えてください。',
    simple: {
      label: 'シンプル',
      description:
        'Hermes と話すための表示。サイドバーとチャットのみ。ターミナル、ファイル、差分のペインは表示しません。'
    },
    advanced: {
      label: '詳細',
      description: '開発者向け。ターミナル、ファイル、差分、ステータスバー、レイアウトを設定したとおりに。'
    }
  },

  zones: {
    showTabStrip: 'タブを表示',
    hideTabStrip: 'タブを隠す',
    showStripTab: title => `${title} を表示`,
    hideStripTab: title => `${title} を隠す`,
    lastTabKeptTitle: '最後のタブは残ります',
    lastTabKeptBody:
      'このゾーンには少なくとも 1 つの表示タブが必要です。先に別のタブを表示するか、サイドバー全体を折りたたんでください。',
    toggleStripTab: title => `${title} タブを切り替え`,
    minimize: '最小化',
    restore: '復元',
    reload: '再読み込み',
    closeOthers: '他を閉じる',
    closeToRight: '右側を閉じる',
    closeAll: 'すべて閉じる',
    newSessionTab: '新しいセッションタブ',
    newTab: '新しいタブ',
    pluginDisabled: pluginId => `プラグイン「${pluginId}」を無効化しました`,
    pluginDisabledBody: 'スキルとツール → プラグイン で再有効化するとペインが戻ります。',
    missingPane: paneId => `ペインが見つかりません: ${paneId}`,
    editTitle: 'レイアウト',
    editHint: 'レイアウトを選ぶか、ペインをゾーン間へドラッグ。',
    reset: 'リセット',
    templates: 'テンプレート',
    custom: 'カスタム',
    newGridLayout: '新しいグリッドレイアウト',
    saveCurrentAs: '現在の配置をテンプレートとして保存',
    nameLayoutPlaceholder: 'レイアウト名を入力…',
    deletePreset: name => `${name} を削除`,
    zoneEditorTitle: 'ゾーンエディター',
    editorHintPre: 'クリックで分割 · ',
    editorHintPost: ' で線の向きを反転 · ゾーンをまたいでドラッグで結合 · 共有辺をドラッグでリサイズ',
    templateColumns: '列',
    templateRows: '行',
    templateGrid: 'グリッド',
    templatePriority: '優先',
    zoneTag: index => `ゾーン ${index}`,
    mergeZones: count => `${count} 個のゾーンを結合`,
    customZoneName: count => `カスタム ${count} ゾーン`,
    layoutNamePlaceholder: fallback => `レイアウト名（${fallback}）`,
    saveApply: '保存して適用',
    notExpressible: 'この配置は互いに噛み合っています（風車型）— 入れ子の分割では表現できません',
    zoneCount: count => `${count} ゾーン`,
    tabCount: count => `${count} 個のタブ`
  },

  contextMenu: {
    link: {
      openInApp: 'アプリ内ブラウザーで開く',
      openExternal: '外部ブラウザーで開く',
      copyUrl: 'URL をコピー',
      copyResolvedUrl: '解決後の URL をコピー'
    },
    image: {
      copyImage: '画像をコピー',
      copyImageAddress: '画像アドレスをコピー',
      saveImageAs: '画像を名前を付けて保存…'
    },
    edit: {
      cut: '切り取り',
      paste: '貼り付け',
      selectAll: 'すべて選択',
      addToDictionary: '辞書に追加'
    },
    page: {
      copyPageUrl: 'ページの URL をコピー',
      inspectElement: '要素を調査'
    }
  },

  assistant: {
    catalogInstall: {
      preparing: 'インストールを準備中…',
      install: 'インストール',
      advanced: '詳細設定',
      skip: 'スキップ',
      installing: 'インストール中…',
      installed: 'インストール済み',
      notInstalled: '未インストール',
      failed: '失敗',
      showNames: '名前を表示',
      hideNames: '名前を隠す',
      skill: name => `スキル ${name}`,
      kind: { plugin: 'プラグイン', skill: 'スキル' },
      tier: { official: '公式', community: 'コミュニティ' },
      targetProfile: profile => `${profile} プロファイルにインストールします`,
      sendFailed: '回答を送信できませんでした。もう一度お試しください。',
      commitLabel: 'コミット',
      subdirLabel: 'フォルダー',
      securityHeading: 'セキュリティ',
      scan: { passed: 'スキャン合格', warnings: 'スキャンで警告あり', failed: 'スキャン不合格' },
      requirementsLabel: '必要条件',
      credentialsHeading: '認証情報'
    },
    thread: {
      loadingSession: 'セッションを読み込み中',
      showEarlier: '以前のメッセージを表示',
      loadingResponse: 'Hermes が応答を読み込み中',
      resumeWhenBackgroundDone: count =>
        count === 1
          ? 'バックグラウンドタスクの完了後に再開します'
          : `${count} 件のバックグラウンドタスクの完了後に再開します`,
      thinking: '考え中',
      thought: '思考済み',
      thoughtBriefly: '少し思考',
      thoughtFor: duration => `${duration} 思考`,
      completedSteps: count => `${count} ステップ完了`,
      completedStepsIn: (count, duration) => `${count} ステップを ${duration} で完了`,
      turnDuration: duration => `このターンの所要時間: ${duration}`,
      today: time => `今日 ${time}`,
      yesterday: time => `昨日 ${time}`,
      copy: 'コピー',
      refresh: '更新',
      moreActions: 'その他のアクション',
      branchNewChat: '新しいチャットでブランチ',
      react: 'リアクション',
      dismissError: 'エラーを閉じる',
      errorGenericProvider: 'AI サービス',
      errorLayerBodies: {
        generic:
          'Hermes の返信中に問題が発生しました。再試行してください。問題が続く場合はエラー詳細をコピーしてください。',
        provider:
          'AI サービスがリクエストを完了できませんでした。少し待って再試行するか、プロバイダーを切り替えてください。',
        endpoint:
          'カスタムモデルサーバーに接続できません。サーバーが起動しているか確認し、メッセージを再送してください。',
        streaming: '返信が完了する前に接続が切れました。再試行してもう一度送信してください。'
      },
      errorCodes: {
        provider_policy_blocked: {
          title: 'アカウント設定によりこのモデルはブロックされています',
          body: provider =>
            `${provider} はアカウントのデータまたはプライバシー設定により、このリクエストを処理できません。別のモデルまたはプロバイダーを選んでください。`
        },
        content_policy_blocked: {
          title: 'AI サービスが回答を拒否しました',
          body: provider => `${provider} はこのメッセージへの回答を拒否しました。編集して再送してください。`
        },
        format_error: {
          title: 'AI サービスがリクエストの形式を拒否しました',
          body: provider =>
            `${provider} はこのリクエストの形式を受け付けませんでした。プロバイダーを切り替えるか、調査のため診断情報を送信してください。`
        },
        invalid_response: {
          title: 'AI サービスが読み取れない応答を返しました',
          body: provider => `${provider} は Hermes が読み取れない内容を返しました。しばらくしてから再試行してください。`
        },
        empty_response: {
          title: 'AI サービスが空の応答を返しました',
          body: provider => `${provider} はこのメッセージに内容を返しませんでした。しばらくしてから再試行してください。`
        },
        rate_limit: {
          title: 'AI サービスが混み合っています',
          body: provider => `${provider} は現在リクエスト数を制限しています。少し待ってから再試行してください。`
        },
        upstream_rate_limit: {
          title: 'AI サービスが混み合っています',
          body: provider => `${provider} は現在リクエスト数を制限しています。少し待ってから再試行してください。`
        },
        overloaded: {
          title: 'AI サービスの負荷が高すぎます',
          body: provider =>
            `${provider} で現在問題が発生しています。しばらくしてから再試行するか、プロバイダーを切り替えてください。`
        },
        server_error: {
          title: 'AI サービスでエラーが発生しました',
          body: provider =>
            `${provider} がサーバーエラーを返しました。しばらくしてから再試行するか、プロバイダーを切り替えてください。`
        },
        timeout: {
          title: 'AI サービスに接続できません',
          body: provider =>
            `${provider} に接続できないか、時間内に応答がありませんでした。インターネット接続を確認してから再試行してください。`
        },
        ssl_cert_verification: {
          title: '安全な接続に失敗しました',
          body: provider =>
            `Hermes は ${provider} との安全な接続を検証できませんでした。ネットワークやプロキシの設定を確認するか、プロバイダーを切り替えて再送してください。`
        }
      },
      errorLayers: {
        auth: '認証エラー',
        billing: 'クレジット不足',
        disk: 'ディスク容量不足',
        endpoint: 'カスタムエンドポイントのエラー',
        gateway: 'ゲートウェイのエラー',
        generic: 'ターンが失敗しました',
        provider: 'プロバイダーのエラー',
        runtime: 'ローカルランタイムのエラー',
        streaming: 'ストリーミング接続のエラー'
      },
      errorRetry: '再試行',
      errorLimitResets: time => `制限は ${time} にリセットされます`,
      errorRetryAtReset: time => `制限のリセット時に再試行（${time}）`,
      errorRetryScheduled: (time, wait) => `${time} に再試行 — 残り ${wait}`,
      errorRetryScheduledCancel: 'キャンセル',
      errorStartNewSession: '新しいセッションを開始',
      errorSwitchProvider: 'プロバイダーを切り替え',
      errorSignInAgain: provider => `${provider} に再度サインイン`,
      errorOauthExpired: provider =>
        `${provider} のサインインが期限切れか取り消されました。続けるには再度サインインしてください。`,
      errorOpenLogs: 'ログを開く',
      errorOpenLogsFailed: 'ログフォルダを開けませんでした',
      errorOpenDesktopLogs: 'デスクトップのログを開く',
      errorCopyDiagnostics: 'エラー詳細をコピー',
      errorSendDiagnostics: '診断情報を送信',
      filesChanged: count => `${count} 件のファイルを変更`,
      reviewChanges: 'レビュー',
      readAloudFailed: '読み上げに失敗しました',
      preparingAudio: '音声を準備中...',
      stopReading: '読み上げを停止',
      readAloud: '読み上げ',
      copyFullResponse: '回答全体をコピー',
      readAloudFullResponseHint: 'Shiftを押しながらクリック: 回答全体を読み上げ',
      editMessage: 'メッセージを編集',
      stop: '停止',
      restorePrevious: '前のチェックポイントに戻す',
      restoreCheckpoint: 'チェックポイントを復元',
      restoreFromHere: 'チェックポイントを復元 — このプロンプトから再実行',
      restoreTitle: 'このチェックポイントに復元しますか？',
      restoreBody: 'このプロンプト以降のメッセージは会話から削除され、ここからプロンプトが再実行されます。',
      restoreConfirm: '復元して再実行',
      restoreNext: '次のチェックポイントに戻す',
      goForward: '進む',
      sendEdited: '編集済みメッセージを送信',
      attachingFile: '添付中…'
    },
    approval: {
      gatewayDisconnected: 'Hermes ゲートウェイが接続されていません',
      sendFailed: '承認応答を送信できませんでした',
      run: '実行',
      command: 'コマンド',
      moreOptions: 'その他の承認オプション',
      allowSession: 'このセッションで許可',
      alwaysAllowMenu: '常に許可…',
      jumpToApproval: '承認が必要',
      reject: '拒否',
      alwaysTitle: 'このコマンドを常に許可しますか？',
      alwaysDescription: pattern =>
        `これにより "${pattern}" パターンが永続的な許可リスト (~/.hermes/config.yaml) に追加されます。Hermes はこのセッションや将来のセッションで、このようなコマンドについて再度尋ねません。`,
      alwaysAllow: '常に許可'
    },
    clarify: {
      notReady: '明確化リクエストはまだ準備できていません',
      gatewayDisconnected: 'Hermes ゲートウェイが接続されていません',
      sendFailed: '明確化応答を送信できませんでした',
      loadingQuestion: '質問を読み込み中…',
      other: 'その他（回答を入力）',
      placeholder: '回答を入力…',
      skip: 'スキップ',
      skipped: 'スキップ済み',
      noAnswer: '回答なし',
      confirmAndContinueLabel: '確定して続行',
      singleSelectHint: '1つ選ぶ',
      multiSelectHint: '該当するものをすべて選択',
      questionProgress: (answered, total) => `${total}問中${answered}問回答済み`,
      notDelivered:
        'この質問はアプリに届かなかったため、ここでは回答できません。停止を押してターンを終了し、チャットで返信してください。'
    },
    tool: {
      copyCode: 'コードをコピー',
      renderingImage: '画像をレンダリング中',
      copyOutput: '出力をコピー',
      copyCommand: 'コマンドをコピー',
      copyContent: 'コンテンツをコピー',
      copyUrl: 'URL をコピー',
      copyResults: '結果をコピー',
      copyQuery: 'クエリをコピー',
      copyFile: 'ファイルをコピー',
      copyPath: 'パスをコピー',
      failedCalls: (count: number) => `失敗したツール呼び出し: ${count}`,
      skillActivity: {
        loading: 'スキルを読み込み中',
        loaded: 'スキルを読み込みました',
        loadFailed: 'スキルの読み込みに失敗しました',
        readingResource: 'スキルのリソースを読み込み中',
        readResource: 'スキルのリソースを読み込みました',
        resourceFailed: 'スキルのリソースの読み込みに失敗しました',
        listing: 'スキル一覧を取得中',
        listed: 'スキル一覧を取得しました',
        listFailed: 'スキル一覧の取得に失敗しました',
        unavailable: 'スキルの結果を取得できません'
      },
      outputAlt: 'ツール出力',
      rawResponse: '生の応答',
      copyActivity: 'アクティビティをコピー',
      recoveredOne: '1 つの失敗したステップの後に回復しました',
      recoveredMany: count => `${count} つの失敗したステップの後に回復しました`,
      failedOne: '1 つのステップが失敗しました',
      failedMany: count => `${count} つのステップが失敗しました`,
      statusRunning: '実行中',
      statusError: 'エラー',
      statusRecovered: '回復しました',
      statusDone: '完了',
      resultUnavailable: '結果を取得できません',
      resultInterrupted: '中断されました',
      memoryWriteNoted: 'メモリへの書き込みを記録',
      actions: {
        read: '読み取り完了',
        reading: '読み取り中',
        opened: 'オープン済み',
        opening: 'オープン中',
        failedToOpen: 'オープン失敗',
        searched: '検索完了',
        searching: '検索中',
        ran: '実行完了',
        running: '実行中',
        ranCode: 'コード実行完了',
        runningCode: 'スクリプト作成中'
      },
      prefixes: {
        browser: 'ブラウザー',
        web: 'Web'
      },
      titleTemplates: {
        actionCommand: (action, command) => `${action} ${command}`,
        actionQuoted: (action, value) => `「${value}」を${action}`,
        actionTarget: (action, target) => `${target} を${action}`,
        prefixedDone: (prefix, action) => `${prefix} ${action}`,
        runningPrefixedTool: (prefix, action) => `${prefix} ${action}を実行中`,
        runningTool: action => `${action}を実行中`
      },
      titles: {
        browser_click: {
          done: 'ページ要素をクリックしました',
          pending: 'ページ要素をクリック中',
          pendingAction: 'クリック中'
        },
        browser_fill: { done: 'フォーム欄に入力しました', pending: 'フォーム欄に入力中', pendingAction: '入力中' },
        browser_navigate: { done: 'ページを開きました', pending: 'ページをオープン中', pendingAction: 'オープン中' },
        browser_snapshot: {
          done: 'ページスナップショットを取得しました',
          pending: 'ページスナップショットを取得中',
          pendingAction: '取得中'
        },
        browser_take_screenshot: {
          done: 'スクリーンショットを取得しました',
          pending: 'スクリーンショットを取得中',
          pendingAction: '取得中'
        },
        browser_type: { done: 'ページに入力しました', pending: 'ページに入力中', pendingAction: '入力中' },
        clarify: { done: '質問しました', pending: '質問中', pendingAction: '質問中' },
        cronjob: { done: 'Cron ジョブ', pending: 'Cron ジョブをスケジュール中', pendingAction: 'スケジュール中' },
        edit_file: { done: 'ファイルを編集しました', pending: 'ファイルを編集中', pendingAction: '編集中' },
        execute_code: { done: 'コードを実行しました', pending: 'スクリプト作成中', pendingAction: 'スクリプト作成中' },
        image_generate: { done: '画像を生成しました', pending: '画像を生成中', pendingAction: '生成中' },
        list_files: {
          done: 'ファイルを一覧表示しました',
          pending: 'ファイルを一覧表示中',
          pendingAction: '一覧表示中'
        },
        memory: {
          done: 'メモリに保存しました',
          pending: 'メモリに保存中',
          pendingAction: '保存中'
        },
        patch: {
          done: 'ファイルにパッチを適用しました',
          pending: 'ファイルにパッチ適用中',
          pendingAction: 'パッチ適用中'
        },
        read_file: { done: 'ファイルを読み取りました', pending: 'ファイルを読み取り中', pendingAction: '読み取り中' },
        search_files: { done: 'ファイルを検索しました', pending: 'ファイルを検索中', pendingAction: '検索中' },
        session_search_recall: {
          done: 'セッション履歴を検索しました',
          pending: 'セッション履歴を検索中',
          pendingAction: '検索中'
        },
        terminal: { done: 'コマンドを実行しました', pending: 'コマンドを実行中', pendingAction: '実行中' },
        todo: { done: 'Todo を更新しました', pending: 'Todo を更新中', pendingAction: '更新中' },
        vision_analyze: { done: '画像を分析しました', pending: '画像を分析中', pendingAction: '分析中' },
        web_extract: {
          done: 'Web ページを読み取りました',
          pending: 'Web ページを読み取り中',
          pendingAction: '読み取り中'
        },
        web_search: { done: 'Web を検索しました', pending: 'Web を検索中', pendingAction: '検索中' },
        write_file: { done: 'ファイルを編集しました', pending: 'ファイルを編集中', pendingAction: '編集中' }
      }
    }
  },

  prompts: {
    gatewayDisconnected: 'Hermes ゲートウェイが接続されていません',
    sudoSendFailed: 'sudo パスワードを送信できませんでした',
    secretSendFailed: 'シークレットを送信できませんでした',
    sudoTitle: '管理者パスワード',
    sudoDesc:
      'sudo パスワードを入力する前にコマンドを確認してください。パスワードは実行するエージェントに送信され、このセッション中キャッシュされます。',
    sudoCommandUnavailable:
      'エージェントからコマンドが提供されていません。会話で確認できない場合はキャンセルしてください。',
    sudoInstallDesc:
      'Bot Screen のパッケージ（TigerVNC + Xfce）をゲートウェイホストにインストールするため、sudo パスワードが必要です。そのホストにのみ送信されます。',
    sudoPlaceholder: 'sudo パスワード',
    secretTitle: 'シークレットが必要です',
    secretDesc: 'Hermes は続行するための認証情報が必要です。',
    secretPlaceholder: 'シークレット値',
    vaultUnlockSendFailed: 'マスターパスワードを送信できませんでした',
    vaultUnlockTitle: name => `${name} のロックを解除`,
    vaultUnlockDesc: name =>
      `エージェントが ${name} に保存されたログインでサイトにサインインしようとしています。このセッションでロック解除するにはマスターパスワードを入力してください。パスワードはこのマシン上の ${name} に直接渡され、保存されることもエージェントに表示されることもありません。`,
    vaultUnlockPlaceholder: 'マスターパスワード',
    vaultUnlockKeepLocked: 'ロックしたまま',
    vaultUnlockConfirm: 'ロック解除',
    vaultSaveSendFailed: 'ログイン情報を保存できませんでした',
    vaultSaveTitle: site => `${site} のログイン情報を保存しますか？`,
    vaultSaveDesc: origin =>
      `Hermes は ${origin} のサインインページに到達しましたが、保存されたログイン情報がありません。ここで一度入力すると、このマシン上で暗号化して保存され、ページに直接入力されます。モデルはパスワードを一切見ません。`,
    vaultSaveIdentifierLabel: 'メールアドレスまたはユーザー名',
    vaultSaveIdentifierPlaceholder: 'you@example.com',
    vaultSavePasswordPlaceholder: 'パスワード',
    vaultSaveFootnote: '保存したログイン情報は「設定 → パスワードとログイン」で管理できます。',
    vaultSaveDecline: '保存しない',
    vaultSaveConfirm: '保存してサインイン',
    vaultCodeSendFailed: 'コードを送信できませんでした',
    vaultCodeTitle: site => `${site} の確認コード`,
    vaultCodeDesc: site =>
      `${site} がワンタイムコード（SMS、メール、または認証アプリ）を求めています。ここに入力すると Hermes がページに入力します。モデルはコードを一切見ません。`,
    vaultCodeLabel: 'コード',
    vaultCodeFootnote:
      'ヒント：「設定 → パスワードとログイン」でこのログインに認証キーを保存すると、Hermes がコードを自動入力します。',
    vaultCodeSkip: 'スキップ',
    vaultCodeConfirm: 'コードを入力'
  },

  desktop: {
    audioReadFailed: '録音した音声を読み取れませんでした',
    sessionUnavailable: 'セッションが利用できません',
    createSessionFailed: '新しいセッションを作成できませんでした',
    promptFailed: 'プロンプトに失敗しました',
    staleSessionTitle: 'チャットが最新ではありません',
    staleSessionBody:
      'このウィンドウは同じチャットの別ビューより遅れています。最新のメッセージを読み込みました。送信する場合はもう一度送ってください。',
    providerCredentialRequired: '最初のメッセージを送信する前にプロバイダー認証情報を追加してください。',
    emptySlashCommand: '空のスラッシュコマンド',
    slashCommandIgnoredTitle: 'コマンドが送信されませんでした',
    slashCommandIgnoredBody:
      'スラッシュコマンドと添付ファイルを同時に使用することはできません。添付ファイルを削除するか、コマンドを別途送信してください。',
    desktopCommands: 'デスクトップコマンド',
    skillCommandsAvailable: count => `${count} 件のスキルコマンドが利用可能です。`,
    warningLine: message => `警告: ${message}`,
    yoloArmed: 'このチャットでは YOLO が有効になっています',
    yoloOff: 'YOLO オフ',
    yoloSystem: active => `このセッションの YOLO ${active ? 'オン' : 'オフ'}`,
    yoloTitle: 'YOLO',
    yoloToggleFailed: 'YOLO を切り替えられませんでした',
    profileStatus: current =>
      `プロファイル: ${current}。/profile <name> または「新しいセッション」ピッカーを使って別のプロファイルでチャットを始めてください。`,
    unknownProfile: '不明なプロファイル',
    noProfileNamed: (target, available) => `"${target}" という名前のプロファイルはありません。利用可能: ${available}`,
    newChatsProfile: name => `新しいチャットはプロファイル ${name} を使用します。`,
    setProfileFailed: 'プロファイルの設定に失敗しました',
    sttDisabled: '音声認識は設定で無効になっています。',
    stopFailed: '停止に失敗しました',
    regenerateFailed: '再生成に失敗しました',
    editFailed: '編集に失敗しました',
    editTurnUnavailable: 'このターンはサーバー履歴にありません（圧縮で削除された可能性があります）。',
    resumeFailed: '再開に失敗しました',
    readOnlyTranscriptTitle: '読み取り専用で開きました',
    readOnlyTranscriptBody:
      'この古いチャットを所有するバックエンドがまだ接続されていないため、読み取り専用のトランスクリプトとして開きました。履歴は無事です。バックエンドが所有を認識するまで送信は無効です。',
    readOnlyTranscriptSendBlocked: 'このチャットは読み取り専用トランスクリプトとして開いています。送信は無効です。',
    resumeStrandedTitle: 'このセッションを読み込めませんでした',
    resumeStrandedBody:
      'このセッションへの接続に失敗し、自動再試行も停止しました。ゲートウェイが実行中か確認してから、もう一度お試しください。',
    poolSlotTimeoutBody:
      'すべてのローカルプロファイルバックエンドスロットが使用中です。「設定」→「詳細設定」で「Warm Bot Backends」を増やすか、アイドル状態のバックエンドが解放された後に再試行してください。',
    poolSlotTimeoutOpenSettings: '詳細設定を開く',
    resumeRetry: '再試行',
    nothingToBranch: 'ブランチするものがありません',
    branchNeedsChat: 'ブランチする前にチャットを開始または再開してください。',
    sessionBusy: 'セッションが使用中',
    branchStopCurrent: 'このチャットをブランチする前に現在のターンを停止してください。',
    branchNoText: 'このメッセージにはブランチするテキストがありません。',
    branchTitle: n => `下書き: ブランチ #${n}`,
    branchFailed: 'ブランチに失敗しました',
    deleteFailed: '削除に失敗しました',
    archived: 'アーカイブしました',
    archiveFailed: 'アーカイブに失敗しました',
    restored: '復元しました',
    unarchiveFailed: 'アーカイブ解除に失敗しました',
    cwdChangeFailed: '作業ディレクトリの変更に失敗しました',
    cwdStagedTitle: '作業ディレクトリがステージングされました',
    cwdStagedMessage:
      'このアクティブなセッションへの cwd の変更を適用するにはデスクトップバックエンドを再起動してください。',
    modelSwitchConfirmBody: 'このモデル切り替えには確認が必要です。',
    modelSwitchConfirmLabel: 'それでも切り替える',
    modelSwitchConfirmTitle: (model: string) => `${model} に切り替えますか？`,
    modelSwitchConfirmTitleFallback: 'モデルを切り替えますか？',
    modelSwitchFailed: 'モデルの切り替えに失敗しました',
    modelSwitchKeepLabel: '現在のモデルを維持',
    modelSwitchStaleNotice: '選択が変更されたため、モデルの切り替えは適用されませんでした。',
    hydrationSyncing: (profile: string) => `${profile} を同期中\u2026`,
    sessionExported: 'セッションをエクスポートしました',
    sessionExportFailed: 'セッションをエクスポートできませんでした',
    imageSaved: '画像を保存しました',
    downloadStarted: 'ダウンロードを開始しました',
    restartToUseSaveImage: '画像を保存するには Hermes Desktop を再起動してください。',
    restartToSaveImages: '画像を保存するには Hermes Desktop を再起動してください',
    imageDownloadFailed: '画像のダウンロードに失敗しました',
    openImage: '画像を開く',
    downloadImage: '画像をダウンロード',
    savingImage: '画像を保存中',
    zoomIn: '拡大',
    zoomOut: '縮小',
    resetZoom: 'ズームをリセット',
    imagePreviewFailed: '画像のプレビューに失敗しました',
    imageAttach: '画像を添付',
    imageWriteFailed: '画像のディスクへの書き込みに失敗しました。',
    imageAttachFailed: '画像の添付に失敗しました',
    pastedContent: '貼り付けた内容',
    pasteAttachFailed: '貼り付けたテキストを添付できませんでした',
    attachImages: '画像を添付',
    clipboard: 'クリップボード',
    noClipboardImage: 'クリップボードに画像が見つかりません',
    clipboardPasteFailed: 'クリップボードからの貼り付けに失敗しました',
    dropFiles: 'ファイルをドロップ',
    handoff: {
      pickPlatform: '送信先を選択',
      success: platform => `${platform} に引き継ぎました。いつでもここで再開できます。`,
      systemNote: platform => `↻ ${platform} に引き継ぎました — いつでもここで再開できます。`,
      failed: error => `引き継ぎに失敗しました: ${error}`,
      timedOut: 'ゲートウェイの待機がタイムアウトしました。`hermes gateway` は起動していますか？'
    }
  },

  tips: {
    close: 'このヒントを今後表示しない',
    items: {
      'new-session': {
        title: '新しく始める',
        text: '新しいチャットは、専用のコンテキスト・ターミナル・作業ディレクトリを持ちます。'
      },
      skills: {
        title: '一度教えれば覚えます',
        text: 'スキルは手順書のフォルダで、必要な場面で Hermes が自分で読み込みます。'
      },
      messaging: {
        title: 'デスクを離れても Hermes',
        text: 'Telegram、Discord、Slack などに接続。同じエージェント、同じ記憶のままです。'
      },
      artifacts: {
        title: 'Hermes が作ったものすべて',
        text: '全セッションの画像・ファイル・リンクを一箇所にまとめています。'
      },
      cron: {
        title: '自動で動く仕事',
        text: 'プロンプトを毎時・毎晩、または cron 式で実行できます。'
      },
      'command-palette': {
        title: 'すべてはこの一箇所から',
        text: 'セッション、設定、スキル、コマンドはすべてパレットから呼び出せます。'
      },
      profiles: {
        title: 'プロファイルは独立しています',
        text: 'それぞれが独自のキー・メモリ・セッションを持つ、別の Hermes です。'
      },
      'composer-mentions': {
        title: 'ファイルとコマンド',
        text: '@ でファイルを会話に取り込み、/ でコマンドを実行できます。'
      },
      'local-runtime-update': {
        title: 'ローカルエンジンの更新があります',
        text: 'ローカルモデルを実行するエンジンを更新します。実行中のローカルリクエストが中断される場合があります。',
        action: '今すぐ更新'
      },
      'local-setup': {
        title: 'このマシンはローカルでモデルを実行できます',
        text: 'お使いのハードウェアでローカルモデルを動かせます。会話はこのコンピュータから出ず、料金もかかりません。',
        action: 'セットアップ'
      },
      'right-pane': {
        title: '作業用ペイン',
        text: 'ファイル、ターミナル、レビュー、アプリ内ブラウザはサイドペインにまとまっています。'
      }
    }
  },

  errors: {
    genericFailure: '問題が発生しました',
    boundaryTitle: 'インターフェイスで問題が発生しました',
    boundaryDesc: 'ビューで予期しないエラーが発生しました。チャットと設定は安全です。',
    reloadWindow: 'ウィンドウを再読み込み',
    openLogs: 'ログを開く'
  },

  ui: {
    search: {
      clear: '検索をクリア'
    },
    logs: {
      bottom: 'ログの末尾',
      search: 'ログを検索…',
      top: 'ログの先頭'
    },
    pagination: {
      label: 'ページング',
      previous: '前へ',
      previousAria: '前のページへ',
      next: '次へ',
      nextAria: '次のページへ'
    },
    sidebar: {
      title: 'サイドバー',
      description: 'モバイルサイドバーを表示します。',
      toggle: open => `サイドバーを${open ? '表示' : '非表示'}`
    }
  }
})
