"""jiter SSE parse ValueErrors are transient provider failures, not local bugs (#65147)."""
import pytest

from agent.turn_api_error import _is_local_validation_error


@pytest.mark.parametrize("msg", [
    "key must be a string at line 1 column 2",
    "EOF while parsing a value at line 1 column 5",
    "trailing characters at line 1 column 9",
    "expected `,` or `}` at line 1 column 8",
    "invalid number at line 1 column 7",
])
def test_jiter_stream_parse_valueerror_is_not_local(msg):
    assert _is_local_validation_error(ValueError(msg)) is False


def test_unrelated_valueerror_with_line_suffix_stays_local():
    assert _is_local_validation_error(ValueError("bad config at line 3 column 1")) is True


def test_bedrock_internal_server_valueerror_is_not_local():
    """Regression for #138580: Bedrock can put an upstream 500 fault in an SSE ValueError."""
    error = ValueError(
        "Bad response code, expected 200: {'status_code': 400, "
        "'headers': {':exception-type': 'internalServerException'}, "
        "'body': b'{\"message\":\"The system encountered an unexpected error during processing. "
        "Try your request again.\"}'}"
    )

    assert _is_local_validation_error(error) is False
