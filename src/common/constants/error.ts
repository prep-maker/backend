const requireString = (value: string) => `${value}(은)는 문자열이어야 합니다.`;
const requireArray = (value: string) => `${value}(은)는 배열이어야 합니다.`;
const required = (value: string) => `${value}(을)를 입력해주세요.`;

export const ERROR = {
  DUPLICATE_EMAIL: '이미 존재하는 이메일입니다.',
  NOT_FOUND_USER: '유저를 찾을 수 없습니다.',
  NOT_FOUND_WRITING: '글을 찾을 수 없습니다.',
  NOT_FOUND_BLOCK: '블록을 찾을 수 없습니다.',
  INVALID_LOGIN: '이메일 혹은 비밀번호가 잘못되었습니다.',
  INVALID_USER_ID: '잘못된 형식의 user id입니다.',
  INVALID_WRITING_ID: '잘못된 형식의 writing id입니다.',
  INVALID_BLOCK_ID: '잘못된 형식의 block id입니다.',
  INVALID_WIRINTG_QUERY: 'query는 editing, done 중에 하나여야 합니다.',
  UNKNOWN_ERROR: '알수없는 에러',
  INVALID_EMAIL: '잘못된 형식의 email입니다.',
  BLOCK_TYPE:
    'block 타입은 P, R, E, PR, RE, EP, PRE, REP, PREP 중에 하나여야 합니다.',
  EMAIL_REQUIRED: required('email'),
  PASSWORD_REQUIRED: required('비밀번호'),
  NAME_REQUIRED: required('이름'),
  BLOCK_TYPE_REQUIRED: required('블록 타입'),
  BLOCK_LIST_REQUIRED: required('블록 리스트'),
  EMAIL_STRING_REQUIRED: requireString('email'),
  PASSWORD_STRING_REQUIRED: requireString('비밀번호'),
  NAME_STRING_REQUIRED: requireString('이름'),
  TITLE_STRING_REQUIRED: requireString('title'),
  BLOCKS_ARRAY_REQUIRED: requireArray('blocks'),
  PARAGRAPHS_ARRAY_REQUIRED: requireArray('paragraphs'),
  IS_DONE_BOOL_REQUIRED: 'isDone은 boolean이어야 합니다.',
  TITLE_RANGE: 'title은 100글자 이하여야 합니다.',
  PASSWORD_RANGE: '비밀번호는 6자 이상 20자 이하여야 합니다.',
  NAME_RANGE: '이름은 20자 이하여야 합니다.',
  BLOCKS_EXISTING:
    'blocks 프로퍼티는 입력이 불가합니다. blocks 업데이트는 PUT /users/:id/writings/:id/blocks를 이용해야 합니다.',
  NO_BLOCK_TYPE: 'block에 type이 없습니다.',
} as const;
