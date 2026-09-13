import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import useExamPrep from '../src/screens/ExamPrep/hooks/useExamPrep';
import ExamRepository from '../src/repositories/ExamRepository';

jest.mock('../src/repositories/ExamRepository', () => ({
  __esModule: true,
  default: { generatePssaQuestions: jest.fn() },
}));

describe('PSSA exam selection', () => {
  let current: ReturnType<typeof useExamPrep>;
  let renderer: ReactTestRenderer;
  function Harness() {
    current = useExamPrep();
    return null;
  }
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => { renderer = create(<Harness />); });
  });
  afterEach(async () => {
    await act(async () => { renderer.unmount(); });
  });

  it('does not generate PSSA questions from the Coming Soon tab', async () => {
    await act(async () => { current.onTabChange('placeholder_exam'); });
    expect(current!.state.tabs[1].label).toBe('Coming Soon');
    await act(async () => {
      expect((await current.onContinue()).type).toBe('error');
    });
    expect(ExamRepository.generatePssaQuestions).not.toHaveBeenCalled();
  });

  it('uses the selected grade and domain and returns generated questions', async () => {
    const result = { type: 'success', data: { questions: [{ id: 'q1' }] } };
    (ExamRepository.generatePssaQuestions as jest.Mock).mockResolvedValue(result);
    await act(async () => {
      current.onGradeChange('3');
      current.onDomainChange('vocabulary');
    });
    await act(async () => {
      expect(await current.onContinue()).toBe(result);
    });
    expect(ExamRepository.generatePssaQuestions).toHaveBeenCalledWith('3', 'vocabulary', 'medium', 10);
    expect(current!.state.isGenerating).toBe(false);
  });
});
