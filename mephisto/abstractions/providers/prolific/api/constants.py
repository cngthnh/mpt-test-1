EMAIL_FORMAT = '^\\S+@\\S+\\.\\S+$'  # Simple email format checking


# https://docs.prolific.co/docs/api-docs/public/#tag/Studies/The-study-object
# `external_study_url` field
STUDY_URL_PARTICIPANT_ID_PARAM = 'participant_id'
STUDY_URL_PARTICIPANT_ID_PARAM_PROLIFIC_VAR = '{{%PROLIFIC_PID%}}'
STUDY_URL_STUDY_ID_PARAM = 'study_id'
STUDY_URL_STUDY_ID_PARAM_PROLIFIC_VAR = '{{%STUDY_ID%}}'
STUDY_URL_SUBMISSION_ID_PARAM = 'submission_id'
STUDY_URL_SUBMISSION_ID_PARAM_PROLIFIC_VAR = '{{%SESSION_ID%}}'


# HACK: Hardcoded Question IDs (Prolific doesn't have a better way for now)
# TODO (#1008): Make this dynamic as soon as possible
ER_AGE_RANGE_QUESTION_ID = '54ac6ea9fdf99b2204feb893'


class ProlificIDOption:
    NOT_REQUIRED = 'not_required'
    QUESTION = 'question'
    URL_PARAMETERS = 'url_parameters'


class StudyAction:
    AUTOMATICALLY_APPROVE = 'AUTOMATICALLY_APPROVE'
    MANUALLY_REVIEW = 'MANUALLY_REVIEW'
    PUBLISH = 'PUBLISH'
    START = 'START'
    STOP = 'STOP'
    UNPUBLISHED = 'UNPUBLISHED'


class StudyStatus:
    UNPUBLISHED = 'UNPUBLISHED'
    ACTIVE = 'ACTIVE'
    SCHEDULED = 'SCHEDULED'
    PAUSED = 'PAUSED'
    AWAITING_REVIEW = 'AWAITING REVIEW'
    COMPLETED = 'COMPLETED'


class StudyCompletionOption:
    CODE = 'code'
    URL = 'url'


class StudyCodeType:
    COMPLETED = 'COMPLETED'
    FAILED_ATTENTION_CHECK = 'FAILED_ATTENTION_CHECK'
    FOLLOW_UP_STUDY = 'FOLLOW_UP_STUDY'
    GIVE_BONUS = 'GIVE_BONUS'
    INCOMPATIBLE_DEVICE = 'INCOMPATIBLE_DEVICE'
    NO_CONSENT = 'NO_CONSENT'
    OTHER = 'OTHER'


class SubmissionStatus:
    """
    Submission statuses explained
    https://researcher-help.prolific.co/hc/en-gb/articles/360009094114-Submission-statuses-explained
    """
    RESERVED = 'RESERVED'
    ACTIVE = 'ACTIVE'
    TIMED_OUT = 'TIMED-OUT'
    AWAITING_REVIEW = 'AWAITING REVIEW'
    APPROVED = 'APPROVED'
    RETURNED = 'RETURNED'
    REJECTED = 'REJECTED'
    # After you approve or reject a submission, it may have the ‘Processing’ status
    # for a short time before showing as ‘Approved’ or ‘Rejected’.
    PROCESSING = 'PROCESSING'
