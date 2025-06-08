export async function validateRichResults(
  jsonLd: string
): Promise<{ isValid: boolean; errors: string[] }> {
  try {
    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/richResultsTest:run',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testItem: { code: jsonLd } }),
      }
    );
    if (!response.ok) {
      console.error(
        `Validation service responded with status ${response.status}: ${response.statusText}`
      );
      return { isValid: false, errors: ['Validation service unavailable'] };
    }
    const result = (await response.json()) as {
      richResultsIssues?: { message: string }[];
    };
    const issues = result.richResultsIssues ?? [];
    if (issues.length === 0) {
      return { isValid: true, errors: [] };
    }
    const errors = issues.map((issue) => issue.message);
    return { isValid: false, errors };
  } catch (error) {
    console.error('Error validating rich results:', error);
    return { isValid: false, errors: ['Validation service unavailable'] };
  }
}