import { CaseStudyService } from './case-study.service';

describe('CaseStudyService', () => {
  it('is defined as a class', () => expect(CaseStudyService).toBeDefined());
  it('exposes getVisible', () => expect(typeof CaseStudyService.prototype.getVisible).toBe('function'));
  it('exposes getAll', () => expect(typeof CaseStudyService.prototype.getAll).toBe('function'));
  it('exposes getBySlug', () => expect(typeof CaseStudyService.prototype.getBySlug).toBe('function'));
  it('exposes add', () => expect(typeof CaseStudyService.prototype.add).toBe('function'));
  it('exposes update', () => expect(typeof CaseStudyService.prototype.update).toBe('function'));
  it('exposes toggleVisibility', () => expect(typeof CaseStudyService.prototype.toggleVisibility).toBe('function'));
  it('exposes delete', () => expect(typeof CaseStudyService.prototype.delete).toBe('function'));
});
