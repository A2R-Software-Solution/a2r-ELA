import os
import unittest
from unittest.mock import patch
from config.environment import env, load_environment


class EnvironmentTests(unittest.TestCase):
    def test_types_and_integer_keys(self):
        with patch.dict(os.environ, {'INT': '42', 'BOOL': 'false', 'JSON': '{"7": 123}'}):
            self.assertEqual(env('INT', int), 42)
            self.assertFalse(env('BOOL', bool))
            self.assertEqual(env('JSON', dict, integer_keys=True), {7: 123})

    def test_invalid_values_hide_input(self):
        with patch.dict(os.environ, {'BAD': 'sensitive-input'}):
            with self.assertRaisesRegex(ValueError, '^Invalid environment variable BAD; expected int$'):
                env('BAD', int)

    def test_missing_and_blank_values_never_use_defaults(self):
        with patch.dict(os.environ, {}, clear=True):
            for value_type in (str, int, float, bool, dict, list):
                with self.assertRaisesRegex(ValueError, 'MISSING is missing or blank'):
                    env('MISSING', value_type)
            with self.assertRaises(ValueError):
                env('UNUSED_KEY', str, allow_blank=True)
        with patch.dict(os.environ, {'EMPTY': ''}):
            with self.assertRaises(ValueError):
                env('EMPTY', str)
            self.assertEqual(env('EMPTY', str, allow_blank=True), '')

    def test_settings_schema_contains_no_literal_defaults(self):
        import ast
        from pathlib import Path
        tree = ast.parse(Path(__file__).with_name('settings.py').read_text(encoding='utf-8'))
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'env':
                self.assertIsInstance(node.args[1], ast.Name)
                self.assertIn(node.args[1].id, ('str', 'int', 'float', 'bool', 'dict', 'list'))

    def test_firebase_precedence(self):
        with patch.dict(os.environ, {'GCLOUD_PROJECT': 'demo', 'FUNCTIONS_EMULATOR': 'true', 'EXISTING': 'runtime'}, clear=True):
            with patch('config.environment.dotenv_values', side_effect=[
                {'VALUE': 'base', 'EXISTING': 'file'}, {'VALUE': 'project'}, {'VALUE': 'emulator'},
            ]):
                load_environment()
            self.assertEqual(os.environ['VALUE'], 'emulator')
            self.assertEqual(os.environ['EXISTING'], 'runtime')


if __name__ == '__main__':
    unittest.main()
