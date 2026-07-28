/**
 * Document Service — mock implementation.
 *
 * Thin wrapper around existing data accessors.
 * When a real API is available, replace with fetch calls.
 */
import { getDocumentsBySubjectId, getDocumentById, getSubjectById } from "../lib/data";

export { getDocumentsBySubjectId, getDocumentById, getSubjectById };
