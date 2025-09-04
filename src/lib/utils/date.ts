import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * ISO 날짜 문자열을 한국어 형식으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 예: "2025년 9월 4일"
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy년 M월 d일', { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}

/**
 * ISO 날짜 문자열을 짧은 형식으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 예: "2025-09-04"
 */
export function formatDateShort(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}

/**
 * ISO 날짜 문자열을 상대적 시간으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 예: "3시간 전", "2일 전"
 */
export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { 
      addSuffix: true, 
      locale: ko 
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}

/**
 * ISO 날짜 문자열을 시간 포함 형식으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 예: "2025년 9월 4일 오후 8:55"
 */
export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy년 M월 d일 a h:mm', { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}
