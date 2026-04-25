function parseAbsoluteUrl(rawUrl) {
  const trimmedUrl = rawUrl?.trim();
  if (!trimmedUrl) return null;

  try {
    return new URL(trimmedUrl);
  } catch {
    return null;
  }
}

function detectProviderFromUrl(rawUrl) {
  const url = parseAbsoluteUrl(rawUrl);
  const hostname = url?.hostname?.toLowerCase() ?? '';

  if (hostname.includes('matterport.com')) return 'matterport';
  if (hostname.includes('sketchfab.com')) return 'sketchfab';
  if (hostname.includes('kuula.co')) return 'kuula';

  return null;
}

function buildMatterportUrl(modelId, { autoplay = false, sourceUrl } = {}) {
  const source = parseAbsoluteUrl(sourceUrl);
  const url = source && source.hostname?.toLowerCase?.().includes('matterport.com')
    ? new URL(source.toString())
    : new URL('https://my.matterport.com/show/');

  // Matterport share links often carry extra query params that must be preserved.
  // We only normalize the path and the model id.
  url.pathname = '/show/';
  url.searchParams.set('m', modelId);

  if (autoplay) {
    url.searchParams.set('play', '1');
  } else {
    url.searchParams.delete('play');
  }

  return url.toString();
}

function extractMatterportModelId(rawUrl) {
  const url = parseAbsoluteUrl(rawUrl);
  if (!url) return null;

  const queryModelId = url.searchParams.get('m');
  if (queryModelId) {
    return queryModelId;
  }

  const pathSegments = url.pathname.split('/').filter(Boolean);
  const modelsIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === 'models');
  const spaceIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === 'space');

  if (modelsIndex >= 0 && pathSegments[modelsIndex + 1]) {
    return pathSegments[modelsIndex + 1];
  }

  if (spaceIndex >= 0 && pathSegments[spaceIndex + 1]) {
    return pathSegments[spaceIndex + 1];
  }

  return null;
}

function buildInvalidConfig(rawUrl, error) {
  return {
    embedUrl: null,
    publicUrl: rawUrl?.trim() || null,
    error,
  };
}

function getMatterportConfig(rawUrl) {
  const modelId = extractMatterportModelId(rawUrl);

  if (!modelId) {
    return buildInvalidConfig(
      rawUrl,
      "L'URL Matterport doit contenir un identifiant de modele, par exemple `show?m=...` ou `/models/...`.",
    );
  }

  return {
    embedUrl: buildMatterportUrl(modelId, { autoplay: true, sourceUrl: rawUrl }),
    publicUrl: buildMatterportUrl(modelId, { sourceUrl: rawUrl }),
    error: null,
  };
}

function getUnsupportedSketchfabConfig(rawUrl) {
  return buildInvalidConfig(
    rawUrl,
    "Sketchfab n'est plus pris en charge. Merci de remplacer cette visite par une URL Matterport.",
  );
}

function getKuulaConfig(rawUrl) {
  const url = parseAbsoluteUrl(rawUrl);

  if (!url) {
    return buildInvalidConfig(rawUrl, "L'URL Kuula n'est pas valide.");
  }

  const pathSegments = url.pathname.split('/').filter(Boolean);
  const prefix = pathSegments[0]?.toLowerCase();
  const tourId = pathSegments[1];

  if (!tourId) {
    return buildInvalidConfig(
      rawUrl,
      "L'URL Kuula doit ressembler a `https://kuula.co/view/...` ou `https://kuula.co/v/...`.",
    );
  }

  if (prefix === 'embed') {
    return {
      embedUrl: url.toString(),
      publicUrl: `https://kuula.co/view/${tourId}`,
      error: null,
    };
  }

  if (prefix === 'view' || prefix === 'v') {
    return {
      embedUrl: `https://kuula.co/embed/${tourId}`,
      publicUrl: `https://kuula.co/view/${tourId}`,
      error: null,
    };
  }

  return buildInvalidConfig(
    rawUrl,
    "L'URL Kuula doit ressembler a `https://kuula.co/view/...` ou `https://kuula.co/v/...`.",
  );
}

function getIframeConfig(rawUrl) {
  const url = parseAbsoluteUrl(rawUrl);

  if (!url) {
    return buildInvalidConfig(rawUrl, "L'URL d'iframe n'est pas valide.");
  }

  return {
    embedUrl: url.toString(),
    publicUrl: url.toString(),
    error: null,
  };
}

export function getAsset3DViewerConfig(asset) {
  const rawUrl = asset?.assetUrl?.trim() ?? '';
  const provider = asset?.provider?.toLowerCase?.() ?? '';
  const detectedProvider = detectProviderFromUrl(rawUrl);
  const resolvedProvider = provider === 'iframe'
    ? (detectedProvider || provider)
    : (provider || detectedProvider || 'iframe');

  if (!rawUrl) {
    return buildInvalidConfig(rawUrl, "Aucune URL n'a ete renseignee pour cette visite 3D.");
  }

  switch (resolvedProvider) {
    case 'matterport':
      return getMatterportConfig(rawUrl);
    case 'sketchfab':
      return getUnsupportedSketchfabConfig(rawUrl);
    case 'kuula':
      return getKuulaConfig(rawUrl);
    case 'iframe':
      return getIframeConfig(rawUrl);
    default:
      return getIframeConfig(rawUrl);
  }
}

export function normalizeAsset3DSourceUrl(provider, rawUrl) {
  const config = getAsset3DViewerConfig({ provider, assetUrl: rawUrl });
  return config.publicUrl || rawUrl?.trim() || '';
}
